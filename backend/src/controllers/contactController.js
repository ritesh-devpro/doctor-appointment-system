export const sendMessage = async (req, res) => {
  try {
    let { name, email, subject, message } = req.body;

    // Trim input
    name = name?.trim();
    email = email?.trim();
    subject = subject?.trim();
    message = message?.trim();

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Email validation
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isValidEmail.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Limit message length
    if (message.length > 1000) {
      return res.status(400).json({ error: "Message too long" });
    }

   
    const clean = (str) => str.replace(/<[^>]*>?/gm, "");
    message = clean(message);


    console.log("Contact Message:", { name, email, subject, message });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};