import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const result = await model.generateContent("Say Hare Krishna");
    const response = await result.response;

    console.log(response.text());
  } catch (error) {
    console.error("Gemini Error:", error);
  }
}

test();