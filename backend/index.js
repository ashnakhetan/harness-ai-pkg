import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const port = 8000;
app.use(bodyParser.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: 'YOUR API KEY HERE'
});


app.post("/", async (request, response) => {
  try {
    const { chats } = request.body;
    console.log("requests:", chats);

    const base64_image = "https://i0.wp.com/i1258.photobucket.com/albums/ii529/tbrsevans/Phaeton%20Laundry%20Room/IMG_7313.jpg";
    const TEXTPROMPT = 'CONTEXT: You are given a photo of a scene in a household.\n\n TASK: Output a list of the objects in this photo as a list of tuples ("Item", Location within the Photo). Only output the list.\n Here is an example: [(Potato, bottom right corner), (Kleenex wipes, left foreground)]';

    console.log("CONTEONTS: ", chats)
    if (chats.length > 0 && chats[chats.length - 1].content != "Here's my image:") {
      console.log("here")
      const response1 = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            "role": "system",
            "content": "You are a helpful assistant. Make sure you always output a list of tuples that can be easily processed."
          },
          {
            "role": "user",
            "content": [
              {"type": "text", "text": chats[chats.length - 1].content},
              {
                "type": "image_url",
                "image_url": base64_image
              },
            ],
          },
        ],
        max_tokens: 300,
      });
  
      var result4 = response1.choices[0].message;
      console.log(result4);

      response.json({
        output: result4,
      });

      return;
    }

    const response1 = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          "role": "system",
          "content": "You are a helpful assistant. Make sure you always output a list of tuples that can be easily processed."
        },
        {
          "role": "user",
          "content": [
            {"type": "text", "text": TEXTPROMPT},
            {
              "type": "image_url",
              "image_url": base64_image
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    var result1 = response1.choices[0].message;
    console.log(result1);

    // PROMPT 2
    const TEXTPROMPT2 = 'CONTEXT: You are given a list of tuples of (object, location of the object) that are in a photo along with the original photo. \n \n TASK: Verify that these objects are in the photo and REMOVE any objects that are NOT in the photo from the list. Make sure you only remove objects that are not visible in the photo. Please output just the list of the included items with the location as tuples. \n Here is an example: [(Potato, bottom right corner), (Kleenex wipes, left foreground)] \n \n Here is the list:\n' + result1.content;
    // console.log("TEXTPROMPT2: ", TEXTPROMPT2);
    const response2 = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          "role": "system",
          "content": "You are a helpful assistant. Make sure you ONLY output a list of tuples that can be easily processed."
        },
        {
          "role": "user",
          "content": [
            {"type": "text", "text": TEXTPROMPT2},
            {
              "type": "image_url",
              "image_url": base64_image
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const result2 = response2.choices[0].message;
    console.log(result2);

    // PROMPT 2
    const TEXTPROMPT3 = 'CONTEXT: You are a home assistant who identifies potential safety risks from an image. Here is the description of the household with all the names: \n\n The household that lives in this house has 3 profiles:\n - Mom, 32 years old \n -Dad, 31 years old \n Kid, 2 years old, allergic to peanuts. \n \n You are given a list of objects in the image and the original image. \n \n \n TASK: Please identify which objects FROM THE PROVIDED LIST are significant household dangers. If an object is not a SIGNIFICANT danger to anyone in the household, do not include it in the final output. Do not be overly cautious. \n \n Organize the household dangers in a bullet list, separated out by members of the household. Order the bullet points by order of perceived danger. Here is an example of an output to produce: \n \n "Household: \n - Fire: There is a fire in the background. \n \n Two-year-old: \n - Peanut Allergy: The open jar of peanut butter could be deadly. \n - Legos: Could be a choking hazard. Here is the list'+ result2;    // console.log("TEXTPROMPT2: ", TEXTPROMPT2);
    const response3 = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          "role": "system",
          "content": "You are a helpful assistant. Make sure you ONLY output a list of tuples that can be easily processed."
        },
        {
          "role": "user",
          "content": [
            {"type": "text", "text": TEXTPROMPT3},
            {
              "type": "image_url",
              "image_url": base64_image
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const result3 = response3.choices[0].message;
    console.log(result3);

    response.json({
      output: result3,
    });

  } catch (error) {
    console.error("Error processing request:", error);
    response.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
