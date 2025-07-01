
import dotenv from "dotenv";
import fetch from "node-fetch";
import File from "../models/File.js";
dotenv.config();

export const Summary = async (req, res) => {
  try {
    const { fileId } = req.body;

    const user = await File.findById(fileId);
    if (!user) {
      return res.status(404).json({ success: false, message: "File not found" });
    }
    const text = user.textContent;
    console.log("Extracted text:", text);

    // Smart chunking function that respects context and maintains optimal sizes
    const smartChunking = (text, maxChunkSize = 800, minChunkSize = 200) => {
      const cleanText = text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/•/g, '\n• ')
        .replace(/\./g, '. ')
        .replace(/,/g, ', ')
        .replace(/:/g, ': ')
        .replace(/\s+/g, ' ')
        .trim();

      const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 10);

      const chunks = [];
      let currentChunk = '';

      for (let sentence of sentences) {
        sentence = sentence.trim();

        if (currentChunk.length + sentence.length > maxChunkSize) {
          if (currentChunk.length >= minChunkSize) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
          } else {
            currentChunk += ' ' + sentence;
          }
        } else {
          currentChunk += (currentChunk ? ' ' : '') + sentence;
        }
      }

      if (currentChunk.trim().length >= minChunkSize) {
        chunks.push(currentChunk.trim());
      }

      return chunks;
    };

    // Alternative: Topic-based chunking (more advanced)
    const topicBasedChunking = (text, maxChunkSize = 800) => {
      const topicIndicators = [
        /\n\d+\./g,
        /\n[A-Z][^.]*:/g,
        /\n[A-Z\s]{3,}\n/g,
        /\n\s*[-•]\s*/g,
        /\n\s*\*\s*/g,
      ];

      let chunks = [text];

      for (let indicator of topicIndicators) {
        const newChunks = [];
        for (let chunk of chunks) {
          const splits = chunk.split(indicator);
          newChunks.push(...splits.filter(s => s.trim().length > 50));
        }
        chunks = newChunks;
      }

      const finalChunks = [];
      let currentChunk = '';

      for (let chunk of chunks) {
        if (currentChunk.length + chunk.length <= maxChunkSize) {
          currentChunk += (currentChunk ? '\n' : '') + chunk;
        } else {
          if (currentChunk) {
            finalChunks.push(currentChunk.trim());
          }

          if (chunk.length > maxChunkSize) {
            const subChunks = smartChunking(chunk, maxChunkSize);
            finalChunks.push(...subChunks);
            currentChunk = '';
          } else {
            currentChunk = chunk;
          }
        }
      }

      if (currentChunk.trim()) {
        finalChunks.push(currentChunk.trim());
      }

      return finalChunks.filter(chunk => chunk.length > 100);
    };

    // Sliding window chunking (maintains context overlap)
    const slidingWindowChunking = (text, chunkSize = 800, overlap = 200) => {
      const words = text.split(/\s+/);
      const chunks = [];

      for (let i = 0; i < words.length; i += chunkSize - overlap) {
        const chunk = words.slice(i, i + chunkSize).join(' ');
        if (chunk.trim().length > 100) {
          chunks.push(chunk.trim());
        }
      }

      return chunks;
    };

    // Updated generateDetailedSummary with better chunking
    const generateDetailedSummary = async (text) => {
      try {
        console.log("Original text length:", text.length);

        const chunks = smartChunking(text, 800, 200);
        console.log(`Created ${chunks.length} chunks`);

        chunks.forEach((chunk, i) => {
          console.log(`Chunk ${i + 1} size: ${chunk.length} characters`);
        });

        const detailedSummaries = [];

        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];

          try {
            const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                inputs: chunk,
                parameters: {
                  max_length: Math.min(300, Math.floor(chunk.length * 0.4)),
                  min_length: Math.min(100, Math.floor(chunk.length * 0.15)),
                  do_sample: false,
                  early_stopping: true
                }
              }),
            });

            if (!response.ok) {
              console.error(`API call failed for chunk ${i + 1}: ${response.status}`);
              continue;
            }

            const result = await response.json();

            let summary;
            if (Array.isArray(result) && result[0]?.summary_text) {
              summary = result[0].summary_text;
            } else if (result.summary_text) {
              summary = result.summary_text;
            } else if (result.error) {
              console.error(`API error for chunk ${i + 1}:`, result.error);
              continue;
            }

            if (summary && summary.trim().length > 20) {
              detailedSummaries.push({
                section: i + 1,
                originalLength: chunk.length,
                summary: summary.trim(),
                preview: chunk.substring(0, 100) + "..."
              });
            }

            await new Promise(resolve => setTimeout(resolve, 1500));

          } catch (chunkError) {
            console.error(`Error processing chunk ${i + 1}:`, chunkError);
            continue;
          }
        }

        if (detailedSummaries.length === 0) {
          return "No summaries could be generated from the provided text.";
        }

        const formatText = (text) => {
          return text
            .replace(/•/g, '\n• ')
            .replace(/\.([A-Z])/g, '. $1')
            .replace(/EIA/g, ' EIA ')
            .replace(/EMP/g, ' EMP ')
            .replace(/\s+/g, ' ')
            .replace(/•\s*/g, '\n• ')
            .trim();
        };

        const formattedSummary = detailedSummaries
          .map(item => {
            const cleanSummary = formatText(item.summary);
            return `**Section ${item.section}** (${item.originalLength} chars):\n\n${cleanSummary}\n`;
          })
          .join('\n' + '─'.repeat(50) + '\n\n');

        return {
          summary: formattedSummary,
          totalSections: detailedSummaries.length,
          processingStats: {
            originalLength: text.length,
            chunksProcessed: chunks.length,
            successfulSummaries: detailedSummaries.length
          }
        };

      } catch (error) {
        console.error("Detailed summary error:", error);
        throw error;
      }
    };

    // Generate the detailed summary
    const result = await generateDetailedSummary(text);

    // Return the result
    return res.status(200).json({
      success: true,
      summary: result.summary,
      totalSections: result.totalSections,
      processingStats: result.processingStats
    });
  } catch (error) {
    console.error("Summary controller error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while generating the summary.",
      error: error.message
    });
  }
};
