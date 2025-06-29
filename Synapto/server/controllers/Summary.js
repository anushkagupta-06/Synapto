import fs from "fs";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";

dotenv.config();

export const Summary = async (req, res) => {
  try {
    console.log("Received file:", req.file);
    
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Use path.resolve to handle path correctly
    const filePath = path.resolve(req.file.path);
    console.log("File path:", filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: "File not found on server." });
    }

    const buffer = fs.readFileSync(filePath);
    console.log("Buffer length:", buffer.length);

    // Add error handling for PDF parsing
    let data;
    try {
      data = await pdfParse(buffer);
      console.log("PDF parsed successfully");
    } catch (pdfError) {
      console.error("PDF Parse Error:", pdfError);
      return res.status(400).json({ error: "Failed to parse PDF file. Please ensure it's a valid PDF." });
    }

    const text = data.text?.slice(0, 1500) || "No readable text found.";
    console.log("Extracted text:", text);

    // Smart chunking function that respects context and maintains optimal sizes
    const smartChunking = (text, maxChunkSize = 800, minChunkSize = 200) => {
      // Clean and normalize text while preserving some formatting
      const cleanText = text
        // Fix common PDF extraction issues
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase
        .replace(/•/g, '\n• ') // Fix bullet points
        .replace(/\./g, '. ') // Add space after periods
        .replace(/,/g, ', ') // Add space after commas
        .replace(/:/g, ': ') // Add space after colons
        .replace(/\s+/g, ' ') // Normalize multiple spaces
        .trim();
      
      // Split by sentences first
      const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 10);
      
      const chunks = [];
      let currentChunk = '';
      
      for (let sentence of sentences) {
        sentence = sentence.trim();
        
        // If adding this sentence would exceed max size
        if (currentChunk.length + sentence.length > maxChunkSize) {
          // Only add chunk if it meets minimum size
          if (currentChunk.length >= minChunkSize) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
          } else {
            // Current chunk too small, add sentence anyway
            currentChunk += ' ' + sentence;
          }
        } else {
          // Add sentence to current chunk
          currentChunk += (currentChunk ? ' ' : '') + sentence;
        }
      }
      
      // Add the last chunk if it exists
      if (currentChunk.trim().length >= minChunkSize) {
        chunks.push(currentChunk.trim());
      }
      
      return chunks;
    };

    // Alternative: Topic-based chunking (more advanced)
    const topicBasedChunking = (text, maxChunkSize = 800) => {
      // Split by potential topic indicators
      const topicIndicators = [
        /\n\d+\./g,  // Numbered lists
        /\n[A-Z][^.]*:/g,  // Headers with colons
        /\n[A-Z\s]{3,}\n/g,  // ALL CAPS headers
        /\n\s*[-•]\s*/g,  // Bullet points
        /\n\s*\*\s*/g,  // Asterisk bullets
      ];
      
      let chunks = [text];
      
      // Split by each topic indicator
      for (let indicator of topicIndicators) {
        const newChunks = [];
        for (let chunk of chunks) {
          const splits = chunk.split(indicator);
          newChunks.push(...splits.filter(s => s.trim().length > 50));
        }
        chunks = newChunks;
      }
      
      // Merge small chunks and split large ones
      const finalChunks = [];
      let currentChunk = '';
      
      for (let chunk of chunks) {
        if (currentChunk.length + chunk.length <= maxChunkSize) {
          currentChunk += (currentChunk ? '\n' : '') + chunk;
        } else {
          if (currentChunk) {
            finalChunks.push(currentChunk.trim());
          }
          
          // If this chunk is too large, split it by sentences
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
        
        // Use smart chunking instead of simple splitting
        const chunks = smartChunking(text, 800, 200);
        console.log(`Created ${chunks.length} chunks`);
        
        // Log chunk sizes for debugging
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
                  max_length: Math.min(300, Math.floor(chunk.length * 0.4)), // Adaptive max length
                  min_length: Math.min(100, Math.floor(chunk.length * 0.15)), // Adaptive min length
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
            
            // Handle different response formats
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
            
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1500));
            
          } catch (chunkError) {
            console.error(`Error processing chunk ${i + 1}:`, chunkError);
            continue;
          }
        }
        
        // Format the final summary with better spacing
        if (detailedSummaries.length === 0) {
          return "No summaries could be generated from the provided text.";
        }
        
        // Helper function to format text with proper spacing
        const formatText = (text) => {
          return text
            // Add spaces around bullet points
            .replace(/•/g, '\n• ')
            // Add spaces around periods followed by capital letters
            .replace(/\.([A-Z])/g, '. $1')
            // Add spaces around common abbreviations
            .replace(/EIA/g, ' EIA ')
            .replace(/EMP/g, ' EMP ')
            // Fix multiple spaces
            .replace(/\s+/g, ' ')
            // Add proper line breaks for bullet points
            .replace(/•\s*/g, '\n• ')
            // Clean up extra spaces
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
    console.error("Summary Error:", error.message);
    return res.status(500).json({ error: "Error generating summary." });
  }
};