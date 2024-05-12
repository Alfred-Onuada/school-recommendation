/* eslint-disable max-len */
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {config} from "dotenv";
config();

import {onRequest} from "firebase-functions/v2/https";
import OpenAI from "openai";
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const getRecommendation = onRequest({timeoutSeconds: 180, cors: ["https://school-recommendation.web.app", "http://localhost:4200"]}, async (request, response) => {
  // make request to gpt 4 and send back response
  const chat = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: `You are a helpful school hunt guide, some students come to you with their academic and personal information you are to use this information to recommend schools and possible courses for them to take. The students are mostly going to be nigerians so you have to account for things like JAMB and WAEC for JAMB the score range is 0 - 400 while for waec you need 9 subjects with grades A1, B2, B3, etc. up to F9.

        a sample request will contain information in json format like below
        
        {
            "firstName": "John",
            "lastName": "Doe",
            "gender": "male",
            "dateOfBirth": "2024-05-16",
            "phoneNumber": "11111111111",
            "email": "aonuada5@gmail.com",
            "nationality": "Nigerian",
            "state": "Rivers",
            "highSchool": "Charles Dale",
            "jambScore": "275",
            "jambSubjects": "Maths, Physics, English, Economics",
            "waecScores": "Maths A1, English B2, Data Processing A1",
            "standardizedTests": "250",
            "academicHonors": "Valendictorian",
            "englishProficiency": "TOEFL - 90",
            "otherLanguageProficiency": "Duolingo English Test - 150",
            "desiredCareerPath": "Software Engineer",
            "industryInterests": "Tech",
            "longTermGoals": "I want to make a million dollars",
            "preferredDestinations": "Nigeria",
            "essay": "Some stuff"
        }
        
        your response is going to be outputted into a <div> so make sure it follows proper HTML conventions and add styles to it as needed in a <style> tag, DO NOT set a font, it already exists.
        
        Your response should contain the universities name, the recommended course and reasons why it was recommended, and steps to help the person complete an application including the universities website
        
        RECOMMEND at least 3 schools
        
        USE THE FOLLOWING AS A SAMPLE TEMPLATE FEEL FREE TO MODIFY IT BY USING DIFFERENT COLORS AND MAKE IT BETTER
        
        <div class="px-6 py-4 bg-gray-100">
          <h1 class="text-3xl font-bold text-gray-800 mb-6">University Recommendations for Alfred Onuada</h1>

          <div class="space-y-6">
            <div class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 shadow-lg">
              <div class="font-semibold text-xl text-blue-800 mb-4">University of Cambridge</div>
              <div class="text-gray-700">
                <p><strong class="text-blue-900">Recommended Course:</strong> Medicine (MBBS)</p>
                <p class="mb-4">With your JAMB score of 275 and exemplary WAEC grades in subjects critical to a medical career, University of Cambridge offers one of the top medicine programs globally. Your essay and academic honors suggest a high level of commitment and intellectual ability, which aligns perfectly with the rigor at Cambridge.</p>
                <strong class="text-blue-900">Steps to Apply:</strong>
                <ol class="list-decimal pl-6">
                  <li>Visit the official University of Cambridge website at <a href="https://www.cam.ac.uk" target="_blank" class="text-blue-600 hover:text-blue-800">https://www.cam.ac.uk</a>.</li>
                  <li>Navigate to the 'Admissions' section and choose 'Undergraduate' to find the Medicine course.</li>
                  <li>Review the course requirements and ensure all standardized tests like TOEFL are updated.</li>
                  <li>Complete the UCAS application form and prepare for any required interviews or additional tests.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
`,
      },
      {
        role: "user",
        content: `This is my information ${JSON.stringify(request.body)}`,
      },
    ],
  });

  const resp = chat.choices[0].message.content;

  if (!resp) {
    response.status(500).send("An error occured");
    return;
  }

  response.json({resp});
});
