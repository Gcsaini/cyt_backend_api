import expressAsyncHandler from "express-async-handler";

export const shareProfile = expressAsyncHandler(async (req, res, next) => {
const profileId = req.params.id;

  const profile = {
    id: profileId,
    name: "Gopi chand",
    image: "https://www.verywellmind.com/thmb/tYqyBFINTkwRNXjN_5UciLWfurE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1442821412-458a501ee00a41369eab12c4f9596b2b.jpg",
    service: "Therapist",
  };

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta property="og:title" content="${profile.name}" />
      <meta property="og:description" content="Book a session with ${profile.name}, an expert ${profile.service}." />
      <meta property="og:image" content="${profile.image}" />
      <meta property="og:url" content="https://chooseyourtherapist.in/view-profile/${profile.id}" />
      <meta name="twitter:card" content="summary_large_image" />
      <title>${profile.name} - Profile</title>
    </head>
    <body>
      <script>
        window.location.href = "https://chooseyourtherapist.in/view-profile/${profile.id}";
      </script>
    </body>
    </html>
  `);
});