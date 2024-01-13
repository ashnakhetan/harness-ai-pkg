// import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const port = 8000;
app.use(bodyParser.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: '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'
});

app.post("/", async (request, response) => {
  const { chats } = request.body;
  console.log("requests:", chats);
  const base64_image = request.body.image;
  console.log("base64_image:", base64_image);
  TEXTPROMPT = 'CONTEXT: You are given a photo of a scene in a household.\n\n TASK: Output a list of the objects in this photo as a list of tuples ("Item", Location within the Photo). Only output the list.\n Here is an example: [(Potato, bottom right corner), (Kleenex wipes, left foreground)]';

  const result = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages:[
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
            "image_url": {
              "url": "data:image/jpeg;base64,${base64_image}"
            },
          },
        ],
      },
      ...chats
  ],
  max_tokens:300,
  });

  console.log(result);
  response.json({
    output: result.choices[0].message,
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
