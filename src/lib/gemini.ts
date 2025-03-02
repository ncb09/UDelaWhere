import { GoogleGenerativeAI, Part } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to analyze an image and get a recognizability score (1-10)
export async function analyzeImageRecognizability(imageUrl: string): Promise<number> {
  try {
    console.log(`🔍 ANALYZING IMAGE: ${imageUrl}`);
    
    // Check API key first
    if (!API_KEY) {
      console.error("❌ ERROR: Gemini API key is missing. Please check your .env file.");
      return 5;
    } else {
      console.log("✅ API key is present");
    }
    
    // For local images, we need to fetch them first
    console.log("📥 Fetching image...");
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      console.error(`❌ ERROR: Failed to fetch image from ${imageUrl}: ${imageResponse.status} ${imageResponse.statusText}`);
      return 5;
    }
    
    const imageBlob = await imageResponse.blob();
    console.log(`📊 Image fetched successfully, size: ${imageBlob.size} bytes, type: ${imageBlob.type}`);
    
    if (imageBlob.size === 0) {
      console.error("❌ ERROR: Image blob is empty");
      return 5;
    }
    
    // Prepare image data for Gemini
    console.log("🔄 Converting image to base64...");
    const base64Data = await blobToBase64(imageBlob);
    
    if (!base64Data) {
      console.error("❌ ERROR: Failed to convert image to base64");
      return 5;
    }
    console.log(`✅ Image converted to base64 (length: ${base64Data.length})`);
    
    const imagePart: Part = {
      inlineData: {
        data: base64Data,
        mimeType: imageBlob.type,
      },
    };

    // Initialize the Gemini Pro Vision model
    console.log("🤖 Initializing Gemini model...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // The prompt that instructs Gemini what to do
    const prompt = `
      Analyze this image of a location at the University of Delaware.
      Rate it on a scale of 1 to 10 for how recognizable the location is.
      A score of 1 means it's very difficult to recognize where this is on campus.
      A score of 10 means it's extremely easy to identify the exact location.
      Consider factors like:
      - Presence of distinctive landmarks or buildings
      - Visibility of signage or campus markers
      - Unique architectural features
      - Clear sight lines to known campus areas
      
      Respond ONLY with a single number between 1 and 10, nothing else.
    `;

    // Generate content with the image
    console.log("🚀 Sending request to Gemini API...");
    try {
      const result = await model.generateContent([prompt, imagePart]);
      console.log("✅ Received response from Gemini API");
      
      const responseText = await result.response.text();
      console.log(`📝 Raw response from Gemini: "${responseText}"`);
      
      // Extract just the number from the response
      const match = responseText.trim().match(/\d+/);
      console.log(`🔢 Extracted match: ${match ? match[0] : 'no match found'}`);
      
      if (!match) {
        console.error("❌ ERROR: Could not extract a number from the Gemini response");
        return 5;
      }
      
      const score = parseInt(match[0]);
      console.log(`🎯 Parsed score: ${score}`);
      
      // Ensure the score is between 1 and 10
      const finalScore = Math.min(Math.max(score, 1), 10);
      console.log(`🏆 Final recognizability score: ${finalScore}`);
      
      return finalScore;
    } catch (apiError) {
      console.error("❌ ERROR: Gemini API call failed:", apiError);
      return 5;
    }
  } catch (error) {
    console.error("❌ ERROR: Error analyzing image with Gemini:", error);
    // Return a default mid-range score if analysis fails
    return 5;
  }
}

// Helper function to convert blob to base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const base64String = reader.result as string;
        // Extract just the base64 part (remove data URI prefix)
        const base64 = base64String.split(',')[1];
        resolve(base64);
      } catch (error) {
        console.error("❌ ERROR: Error processing base64 conversion result:", error);
        reject(error);
      }
    };
    reader.onerror = (error) => {
      console.error("❌ ERROR: Error converting blob to base64:", error);
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
}

// Batch process all location images and store recognizability scores
export async function processLocationImages(locations: any[]): Promise<any[]> {
  console.log(`🔄 Processing ${locations.length} locations with Gemini...`);
  const updatedLocations = [...locations];
  
  for (let i = 0; i < updatedLocations.length; i++) {
    const location = updatedLocations[i];
    console.log(`📍 Processing location ${i+1}/${locations.length}: ${location.id} - ${location.name}`);
    
    // If the location doesn't have a recognizability score yet
    if (!location.recognizability) {
      try {
        // Get the first image from the cubemap (px.jpg) for analysis
        // Make sure we're getting the absolute URL
        let imageUrl = '';
        
        // Handle different image path formats
        if (location.image.includes('/')) {
          // Build the correct URL
          imageUrl = `${window.location.origin}${location.image}px.jpg`;
        } else {
          // If it's not a path with slashes, something is wrong
          console.error(`❌ ERROR: Invalid image path format for location ${location.id}: ${location.image}`);
          updatedLocations[i] = { ...location, recognizability: 5 };
          continue;
        }
        
        console.log(`🔗 Image URL for location ${location.id}: ${imageUrl}`);
        
        // Analyze the image
        const score = await analyzeImageRecognizability(imageUrl);
        // Add the score to the location
        updatedLocations[i] = { ...location, recognizability: score };
        console.log(`✅ Analyzed location ${location.id}: Recognizability score = ${score}`);
      } catch (error) {
        console.error(`❌ ERROR: Failed to analyze location ${location.id}:`, error);
        // Default to medium recognizability if we cannot analyze
        updatedLocations[i] = { ...location, recognizability: 5 };
      }
    } else {
      console.log(`ℹ️ Location ${location.id} already has recognizability score: ${location.recognizability}`);
    }
  }
  
  return updatedLocations;
} 