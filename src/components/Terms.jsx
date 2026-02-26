import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronDown,
  FiFileText,
  FiShield,
  FiLock,
  FiCheckCircle,
} from "react-icons/fi";
import "../styles/Terms.css";

const sectionsData = [
  {
    id: "summary",
    title: "Summary",
    icon: <FiFileText />,
    content: (
      <>
        <p>
          Welcome to Auri. This summary provides a warm overview of our commitment to your privacy and safety. 
          Auri is a community-driven platform where you can connect, share media, and even run your own shop. 
          We believe in complete transparency: your data is yours, your messages are private, and we never use 
          your content to train AI models. Whether you're exploring the feed, discovering hidden easter eggs, 
          or selling unique items in the shop, we prioritize a secure and respectful environment for everyone.
        </p>{" "}
        <br />
        <h4>Quick Highlights:</h4>
        <ul>
          <li><strong>Direct User Shop:</strong> List your own items, keep 100% of the profit, and enjoy a safe marketplace where every item is human-vetted.</li>
          <li><strong>Privacy First:</strong> Your messages are end-to-end encrypted and your content is never shared or used to train AI.</li>
          <li><strong>Proactive Safety:</strong> Smart filtering protects all age groups from inappropriate content while maintaining a warm community.</li>
          <li><strong>Full Data Control:</strong> Whether it's easy account recovery or permanent data deletion, you are always in charge of your information.</li>
          <li><strong>Safe Discoveries:</strong> Explore fun, non-malicious easter eggs hidden throughout the platform for a more engaging experience.</li>
          <br />
          <li><strong>Section Summary:</strong> Auri is a transparent, community-focused platform where your data and privacy are protected, offering a secure marketplace and encrypted social experience.</li>
        </ul>
      </>
    ),
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    icon: <FiShield />,
    content: (
      <>
        <p>
          <strong>Effective Date:</strong> December 2, 2025
        </p>{" "}
        <br />
        <h4>1. Accounts & Access</h4>
        <ul>
          <li>
            Users must create an account to experience the full Auri community.
          </li>
          <li>
            Forgetting credentials? We've made recovery easy and straightforward with instructions directly 
            on the login screen.
          </li>
          <li>
            If you choose to leave, you can request permanent deletion of your account and data at any time. 
            Otherwise, your activity remains saved so you can pick up where you left off.
          </li>
          <li><strong>Summary:</strong> Creating an account is required for full access, with simple recovery options and the right to permanent data deletion.</li>
        </ul>{" "}
        <br />
        <h4>2. The Auri Shop (User-to-User)</h4>
        <ul>
          <li>
            Items in the Auri Shop are sold directly by users, not third parties. Any user can opt to become 
            a seller, provided they follow our safety rules on allowed items.
          </li>
          <li>
            <strong>Profit & Payments:</strong> Sellers keep 100% of their profits. Payments go directly to 
            the seller. Because Auri does not process the payment directly, refunds and returns are managed 
            between the buyer and seller, though we are here to help if disputes arise.
          </li>
          <li>
            <strong>Safety First:</strong> Every item is thoroughly reviewed by our team before it is 
            published to prevent fraudulent activity and ensure community quality.
          </li>
          <li><strong>Summary:</strong> A peer-to-peer marketplace where sellers keep all profits, and every listing is manually vetted for safety and quality.</li>
        </ul>{" "}
        <br />
        <h4>3. Content & Community</h4>
        <ul>
          <li>
            Share your stories, reels, and moments. Content is checked upon publishing to ensure it meets 
            our standards—no NSFW, aggressive wording, or harmful material.
          </li>
          <li>
            <strong>Chat Safety:</strong> All messaging is end-to-end encrypted. Your private conversations 
            are just that—private. They are never leaked or used for any other purpose.
          </li>
          <li>
            <strong>Easter Eggs:</strong> You might stumble upon hidden surprises (easter eggs). These are 
            placed for your enjoyment and are entirely safe and non-malicious.
          </li>
          <li><strong>Summary:</strong> Shared content is moderated for safety, private chats are fully encrypted, and hidden features are strictly for fun and safe.</li>
        </ul>{" "}
        <br />
        <h4>4. Our Use of AI</h4>
        <p>
          We use AI as a protective shield, not a data harvester. AI helps us filter out inappropriate 
          content and protect younger users. <strong>Important:</strong> We do not use your personal 
          content, media, or messages to train our AI models, even with consent.
        </p>{" "}
        <ul>
          <li><strong>Summary:</strong> AI is used exclusively for content moderation and safety, never for training models with user data.</li>
        </ul>
        <br />
        <h4>5. Liability & Disputes</h4>
        <p>
          While we vet shop items and moderate content, users are responsible for their interactions. 
          In cases of disputes, we notify both parties and take appropriate action to maintain platform 
          integrity.
        </p>{" "}
        <ul>
          <li><strong>Summary:</strong> Users are responsible for their interactions, but Auri provides mediation and takes action to ensure platform safety.</li>
        </ul>
        <br />
        <h4>6. Contact & Support</h4>
        <p>
          Our team is here to support you. For any questions regarding the shop, your account, or general 
          help: <a href="mailto:innoxation.tech@gmail.com">support@innoxation.com</a>
        </p>
        <ul>
          <li><strong>Overall Terms Summary:</strong> These terms establish a safe environment where users control their accounts, trade directly with vetting, and enjoy private, moderated social interactions.</li>
        </ul>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    icon: <FiLock />,
    content: (
      <>
        <p>
          <strong>Effective Date:</strong> December 2, 2025
        </p>{" "}
        <br />
        <h4>Our Privacy Promise</h4>
        <p>
          Your privacy is at the heart of everything we build. We collect only what is 
          essential to provide you with a safe, functional, and delightful experience.
        </p>{" "}
        <br />
        <h4>1. Information We Collect</h4>
        <ul>
          <li>
            <strong>Account Details:</strong> Basic info like email, name, age, and location 
            needed to set up your profile.
          </li>
          <li>
            <strong>Your Contributions:</strong> Reviews, feedback, and reports you 
            voluntarily submit to help improve the community.
          </li>
          <li>
            <strong>Private Conversations:</strong> While we store your messages so you can 
            access them, they are end-to-end encrypted. We cannot read them, and they are 
            not shared with anyone.
          </li>
          <li><strong>Summary:</strong> We collect essential account data and voluntary feedback, and store encrypted private messages that only you can read.</li>
        </ul>{" "}
        <br />
        <h4>2. How We Handle Your Data</h4>
        <ul>
          <li>
            <strong>No AI Training:</strong> We pride ourselves on the fact that your 
            content, images, and personal data are never used to train AI models.
          </li>
          <li>
            <strong>Safety & Filtering:</strong> AI is used strictly to filter out harmful 
            content (NSFW, verbal abuse) and to maintain age-appropriate environments.
          </li>
          <li>
            <strong>No Leaks:</strong> User content is not shared with platform owners 
            or third parties for any marketing or training purposes.
          </li>
          <li><strong>Summary:</strong> Your data is used strictly for platform safety and moderation, never for AI training or third-party marketing.</li>
        </ul>{" "}
        <br />
        <h4>3. The User Shop & Third Parties</h4>
        <ul>
          <li>
            We do <strong>not</strong> sell your data to anyone.
          </li>
          <li>
            Third-party services are used <strong>only</strong> for necessary shop 
            logistics, such as managing item listings, tracking deliveries, or 
            digital item fulfillment. These providers only receive the specific info 
            required to complete your transaction.
          </li>
          <li><strong>Summary:</strong> We never sell data, and third-party involvement is limited to essential shop logistics and fulfillment.</li>
        </ul>{" "}
        <br />
        <h4>4. Your Rights & Control</h4>
        <ul>
          <li>
            <strong>Easy Deletion:</strong> You can request full deletion of your account 
            and all associated data whenever you wish.
          </li>
          <li>
            <strong>Data Access:</strong> You have the right to see, correct, or 
            withdraw consent for any optional features you've enabled.
          </li>
          <li>
            <strong>Secure Retention:</strong> If you simply log out, we keep your data 
            safely encrypted so your activities are ready for you when you return.
          </li>
          <li><strong>Summary:</strong> You have complete control over your data, with options to delete, access, or securely store your information.</li>
        </ul>{" "}
        <br />
        <h4>5. Protecting Younger Users</h4>
        <p>
          Auri is designed for users aged 8 and up. Our proactive moderation and AI-driven 
          filtering are specifically tuned to keep the environment safe for younger 
          members of our community.
        </p>{" "}
        <ul>
          <li><strong>Summary:</strong> Specialized safety measures are in place to ensure a protected environment for users aged 8 and above.</li>
        </ul>
        <br />
        <h4>6. Contact Us</h4>
        <p>
          For any privacy-related inquiries:{" "}
          <a href="mailto:innoxation.tech@gmail.com">
            innoxation.tech@gmail.com
          </a>
        </p>
        <ul>
          <li><strong>Overall Privacy Summary:</strong> Auri’s privacy model is built on zero data harvesting, full encryption, and user-led data control to ensure absolute digital safety.</li>
        </ul>
      </>
    ),
  },
  {
    id: "seller_portal",
    title: "Seller Portal Operations",
    icon: <FiCheckCircle />,
    content: (
      <>
        <p>
          <strong>Seller Mini Guidelines</strong>
        </p>{" "}
        <br />
        <h4>1. Seller Onboarding</h4>
        <ul>
          <li>
            To list items, you must identify as a Freelancer, Creator, Designer, Student, or Digital Reseller.
          </li>
          <li>
            Sellers must provide their experience level and delivery capabilities during setup.
          </li>
          <li>
            By completing onboarding, you agree to sell only verified digital goods and ensure all 
            listings are human-reviewed.
          </li>
          <li><strong>Summary:</strong> Sellers must undergo a specific onboarding process, classifying their business type and committing to quality digital standards.</li>
        </ul>{" "}
        <br />
        <h4>2. Allowed Digital Goods</h4>
        <ul>
          <li>
            <strong>Digital Credits:</strong> Mobile data, eSIMs, and gaming credits (Roblox, MLBB, etc.).
          </li>
          <li>
            <strong>Gift Cards:</strong> Legitimate App Store and gaming service gift cards.
          </li>
          <li>
            <strong>Digital Services:</strong> Design (UI/UX, Logos, Branding), Resume Creation, and Social Media assets.
          </li>
          <li>
            <strong>No Physical Shipping:</strong> No items requiring physical shipment are permitted in the Seller Mini portal.
          </li>
          <li><strong>Summary:</strong> Permitted items are strictly digital, covering credits, cards, and professional services, with a total ban on physical shipping.</li>
        </ul>{" "}
        <br />
        <h4>3. Payment & Fulfillment</h4>
        <ul>
          <li>
            Sellers must provide valid payment links or QR codes (GCash, Venmo, Cash App).
          </li>
          <li>
            Sellers are strictly responsible for manually confirming payment received to trigger order fulfillment.
          </li>
          <li>
            Auri acts as a bridge; we do not process funds and are not responsible for the validity of seller-provided links.
          </li>
          <li><strong>Summary:</strong> Sellers manage their own payment methods and are responsible for manual fulfillment once funds are verified.</li>
        </ul>{" "}
        <br />
        <h4>4. Platform Features</h4>
        <ul>
          <li>
            <strong>VIP Membership:</strong> Advanced analytics and priority support for high-performing sellers.
          </li>
          <li>
            <strong>Vetting:</strong> Every digital listing undergoes human review before activation.
          </li>
          <li><strong>Summary:</strong> We provide growth tools and human oversight to maintain a high-quality marketplace for all digital services.</li>
        </ul>
      </>
    ),
  },
];

export const Terms = () => {
  const [activeId, setActiveId] = useState("summary");

  return (
    <motion.div
      className="terms-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="terms-content">
        <div className="terms-header">
          <h1 className="terms-title">Community & <span className="gradient-text">Privacy</span></h1>
          <p className="terms-subtitle">
            Welcome to the heart of Auri's commitment to you. These documents, 
            effective December 2, 2025, outline how we protect your privacy, 
            the rules for our community-driven shop, and how we keep our platform 
            safe and free from data harvesting. We believe in a community built 
            on trust, where your content and messages remain yours alone. 
            Expand each section below to learn more about our practices.
          </p>
        </div>

        <div className="sections-list">
          {sectionsData.map((section) => (
            <div key={section.id} className="section-wrapper">
              <button
                className={`section-header ${activeId === section.id ? 'active' : ''}`}
                onClick={() => setActiveId(activeId === section.id ? null : section.id)}
              >
                <div className="section-header-title">
                  <span className="section-icon">{section.icon}</span>
                  <p style={{ color: 'white' }}>{section.title}</p>
                </div>
                <motion.div
                  animate={{ rotate: activeId === section.id ? 180 : 0 }}
                >
                  <FiChevronDown />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {activeId === section.id && (
                  <motion.div
                    className="section-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {section.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
