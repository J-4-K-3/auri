import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export const EmojiPopup = ({ isOpen, onClose, onEmojiSelect }) => {
  const [activeCategory, setActiveCategory] = useState('standard');

  const emojiCategories = {
    standard: {
      name: 'Standard Faces',
      emojis: [
        { name: 'grinning_face', image: '/emojis/grinning_face_3d.png', display: '😀' },
        { name: 'grinning_face_big_eyes', image: '/emojis/grinning_face_with_big_eyes_3d.png', display: '😃' },
        { name: 'grinning_face_smiling_eyes', image: '/emojis/grinning_face_with_smiling_eyes_3d.png', display: '😄' },
        { name: 'beaming_face_smiling_eyes', image: '/emojis/beaming_face_with_smiling_eyes_3d.png', display: '😁' },
        { name: 'grinning_squinting_face', image: '/emojis/grinning_squinting_face_3d.png', display: '😆' },
        { name: 'grinning_face_sweat', image: '/emojis/grinning_face_with_sweat_3d.png', display: '😅' },
        { name: 'face_tears_joy', image: '/emojis/face_with_tears_of_joy_3d.png', display: '😂' },
        { name: 'rolling_floor_laughing', image: '/emojis/rolling_on_the_floor_laughing_3d (1).png', display: '🤣' },
        { name: 'slightly_smiling_face', image: '/emojis/slightly_smiling_face_3d.png', display: '🙂' },
        { name: 'upside_down_face', image: '/emojis/upside-down_face_3d (1).png', display: '🙃' },
        { name: 'winking_face', image: '/emojis/winking_face_3d.png', display: '😉' },
        { name: 'smiling_face_smiling_eyes', image: '/emojis/smiling_face_with_smiling_eyes_3d.png', display: '😊' },
        { name: 'smiling_face_halo', image: '/emojis/smiling_face_with_halo_3d.png', display: '😇' }
      ]
    },
    love: {
      name: 'Love / Hearts',
      emojis: [
        { name: 'smiling_face_hearts', image: '/emojis/smiling_face_with_hearts_3d.png', display: '🥰' },
        { name: 'smiling_face_heart_eyes', image: '/emojis/smiling_face_with_heart-eyes_3d (1).png', display: '😍' },
        { name: 'star_struck', image: '/emojis/star-struck_3d.png', display: '🤩' },
        { name: 'face_blowing_kiss', image: '/emojis/face_blowing_a_kiss_3d.png', display: '😘' },
        { name: 'kissing_face', image: '/emojis/kissing_face_3d.png', display: '😗' },
        { name: 'smiling_face', image: '/emojis/smiling_face_3d.png', display: '☺️' },
        { name: 'kissing_face_closed_eyes', image: '/emojis/kissing_face_with_closed_eyes_3d.png', display: '😚' },
        { name: 'kissing_face_smiling_eyes', image: '/emojis/kissing_face_with_smiling_eyes_3d.png', display: '😙' }
      ]
    },
    playful: {
      name: 'Food / Playful',
      emojis: [
        { name: 'face_savoring_food', image: '/emojis/face_savoring_food_3d.png', display: '😋' },
        { name: 'face_with_tongue', image: '/emojis/face_with_tongue_3d.png', display: '😛' },
        { name: 'winking_face_tongue', image: '/emojis/winking_face_with_tongue_3d.png', display: '😜' },
        { name: 'zany_face', image: '/emojis/zany_face_3d.png', display: '🤪' },
        { name: 'squinting_face_tongue', image: '/emojis/squinting_face_with_tongue_3d.png', display: '😝' }
      ]
    },
    neutral: {
      name: 'Neutral / Meh',
      emojis: [
        { name: 'money_mouth_face', image: '/emojis/money-mouth_face_3d.png', display: '🤑' },
        { name: 'hugging_face', image: '/emojis/hugging_face_3d.png', display: '🤗' },
        { name: 'face_hand_mouth', image: '/emojis/face_with_hand_over_mouth_3d.png', display: '🤭' },
        { name: 'face_open_eyes_hand_mouth', image: '/emojis/face_with_open_eyes_and_hand_over_mouth_3d.png', display: '🫢' },
        { name: 'face_peeking_eye', image: '/emojis/face_with_peeking_eye_3d.png', display: '🫣' },
        { name: 'shushing_face', image: '/emojis/shushing_face_3d.png', display: '🤫' },
        { name: 'thinking_face', image: '/emojis/thinking_face_3d.png', display: '🤔' },
        { name: 'saluting_face', image: '/emojis/saluting_face_3d.png', display: '🫡' },
        { name: 'zipper_mouth_face', image: '/emojis/zipper-mouth_face_3d.png', display: '🤐' },
        { name: 'face_raised_eyebrow', image: '/emojis/face_with_raised_eyebrow_3d.png', display: '🤨' },
        { name: 'neutral_face', image: '/emojis/neutral_face_3d.png', display: '😐' },
        { name: 'expressionless_face', image: '/emojis/expressionless_face_3d.png', display: '😑' },
        { name: 'face_without_mouth', image: '/emojis/face_without_mouth_3d.png', display: '😶' },
        { name: 'dotted_line_face', image: '/emojis/dotted_line_face_3d.png', display: '🫥' },
        { name: 'face_in_clouds', image: '/emojis/face_in_clouds_3d.png', display: '😶‍🌫️' }
      ]
    },
    smirks: {
      name: 'Smirks / Cool',
      emojis: [
        { name: 'smirking_face', image: '/emojis/smirking_face_3d.png', display: '😏' },
        { name: 'unamused_face', image: '/emojis/unamused_face_3d.png', display: '😒' },
        { name: 'face_rolling_eyes', image: '/emojis/face_with_rolling_eyes_3d.png', display: '🙄' },
        { name: 'grimacing_face', image: '/emojis/grimacing_face_3d.png', display: '😬' },
        { name: 'face_exhaling', image: '/emojis/face_exhaling_3d.png', display: '😮‍💨' },
        { name: 'relieved_face', image: '/emojis/relieved_face_3d.png', display: '😌' },
        { name: 'pensive_face', image: '/emojis/pensive_face_3d.png', display: '😔' },
        { name: 'sleepy_face', image: '/emojis/sleepy_face_3d.png', display: '😪' },
        { name: 'drooling_face', image: '/emojis/drooling_face_3d.png', display: '🤤' },
        { name: 'sleeping_face', image: '/emojis/sleeping_face_3d.png', display: '😴' }
      ]
    },
    medical: {
      name: 'Sick / Medical',
      emojis: [
        { name: 'face_medical_mask', image: '/emojis/face_with_medical_mask_3d.png', display: '😷' },
        { name: 'face_thermometer', image: '/emojis/face_with_thermometer_3d.png', display: '🤒' },
        { name: 'face_head_bandage', image: '/emojis/face_with_head-bandage_3d.png', display: '🤕' },
        { name: 'nauseated_face', image: '/emojis/nauseated_face_3d.png', display: '🤢' },
        { name: 'face_vomiting', image: '/emojis/face_vomiting_3d.png', display: '🤮' },
        { name: 'sneezing_face', image: '/emojis/sneezing_face_3d.png', display: '🤧' }
      ]
    },
    shock: {
      name: 'Shock / Dizzy',
      emojis: [
        { name: 'face_spiral_eyes', image: '/emojis/face_with_spiral_eyes_3d.png', display: '😵‍💫' },
        { name: 'exploding_head', image: '/emojis/exploding_head_3d.png', display: '🤯' }
      ]
    },
    cool: {
      name: 'Cool / Party',
      emojis: [
        { name: 'partying_face', image: '/emojis/partying_face_3d.png', display: '🥳' },
        { name: 'disguised_face', image: '/emojis/disguised_face_3d.png', display: '🥸' },
        { name: 'smiling_face_sunglasses', image: '/emojis/smiling_face_with_sunglasses_3d (1).png', display: '😎' }
      ]
    },
    confused: {
      name: 'Confused / Sad',
      emojis: [
        { name: 'nerd_face', image: '/emojis/nerd_face_3d.png', display: '🤓' },
        { name: 'face_monocle', image: '/emojis/face_with_monocle_3d.png', display: '🧐' },
        { name: 'confused_face', image: '/emojis/confused_face_3d.png', display: '😕' },
        { name: 'face_diagonal_mouth', image: '/emojis/face_with_diagonal_mouth_3d.png', display: '🫤' },
        { name: 'worried_face', image: '/emojis/worried_face_3d.png', display: '😟' },
        { name: 'slightly_frowning_face', image: '/emojis/slightly_frowning_face_3d.png', display: '🙁' },
        { name: 'frowning_face', image: '/emojis/frowning_face_3d.png', display: '☹️' },
        { name: 'face_open_mouth', image: '/emojis/face_with_open_mouth_3d.png', display: '😮' },
        { name: 'hushed_face', image: '/emojis/hushed_face_3d.png', display: '😯' },
        { name: 'astonished_face', image: '/emojis/astonished_face_3d.png', display: '😲' },
        { name: 'flushed_face', image: '/emojis/flushed_face_3d.png', display: '😳' },
        { name: 'pleading_face', image: '/emojis/pleading_face_3d.png', display: '🥺' },
        { name: 'frowning_face_open_mouth', image: '/emojis/frowning_face_with_open_mouth_3d.png', display: '😦' },
        { name: 'anguished_face', image: '/emojis/anguished_face_3d.png', display: '😧' },
        { name: 'fearful_face', image: '/emojis/fearful_face_3d.png', display: '😨' },
        { name: 'anxious_face_sweat', image: '/emojis/anxious_face_with_sweat_3d.png', display: '😰' },
        { name: 'sad_but_relieved_face', image: '/emojis/sad_but_relieved_face_3d.png', display: '😥' },
        { name: 'crying_face', image: '/emojis/crying_face_3d.png', display: '😢' },
        { name: 'loudly_crying_face', image: '/emojis/loudly_crying_face_3d.png', display: '😭' }
      ]
    },
    angry: {
      name: 'Angry / Aggressive',
      emojis: [
        { name: 'face_screaming_fear', image: '/emojis/face_screaming_in_fear_3d.png', display: '😱' },
        { name: 'confounded_face', image: '/emojis/confounded_face_3d.png', display: '😖' },
        { name: 'persevering_face', image: '/emojis/persevering_face_3d.png', display: '😣' },
        { name: 'disappointed_face', image: '/emojis/disappointed_face_3d.png', display: '😞' },
        { name: 'downcast_face_sweat', image: '/emojis/downcast_face_with_sweat_3d.png', display: '😓' },
        { name: 'weary_face', image: '/emojis/weary_face_3d.png', display: '😩' },
        { name: 'tired_face', image: '/emojis/tired_face_3d.png', display: '😫' },
        { name: 'yawning_face', image: '/emojis/yawning_face_3d.png', display: '🥱' },
        { name: 'face_steam_nose', image: '/emojis/face_with_steam_from_nose_3d.png', display: '😤' },
        { name: 'pouting_face', image: '/emojis/pouting_face_3d.png', display: '😡' },
        { name: 'angry_face', image: '/emojis/angry_face_3d.png', display: '😠' }
      ]
    },
    monsters: {
      name: 'Monsters / Horns',
      emojis: [
        { name: 'face_symbols_mouth', image: '/emojis/face_with_symbols_on_mouth_3d.png', display: '🤬' },
        { name: 'smiling_face_horns', image: '/emojis/smiling_face_with_horns_3d.png', display: '😈' },
        { name: 'angry_face_horns', image: '/emojis/angry_face_with_horns_3d.png', display: '👿' },
        { name: 'skull', image: '/emojis/skull_3d.png', display: '💀' },
        { name: 'skull_crossbones', image: '/emojis/skull_and_crossbones_3d.png', display: '☠️' }
      ]
    },
    body: {
      name: 'Eyes / Mouth',
      emojis: [
        { name: 'eye', image: '/emojis/eye_3d.png', display: '👁️' },
        { name: 'eyes', image: '/emojis/eyes_3d.png', display: '👀' },
        { name: 'tongue', image: '/emojis/tongue_3d.png', display: '👅' },
        { name: 'mouth', image: '/emojis/mouth_3d.png', display: '👄' },
        { name: 'biting_lip', image: '/emojis/biting_lip_3d.png', display: '🫦' }
      ]
    },
    hearts: {
      name: 'Heart & Fire Set',
      emojis: [
        { name: 'red_heart', image: '/emojis/red_heart_3d.png', display: '❤️' },
        { name: 'broken_heart', image: '/emojis/broken_heart_3d.png', display: '💔' },
        { name: 'heart_fire', image: '/emojis/heart_on_fire_3d.png', display: '❤️‍🔥' },
        { name: 'beating_heart', image: '/emojis/beating_heart_3d.png', display: '💓' },
        { name: 'fire', image: '/emojis/fire_3d.png', display: '🔥' }
      ]
    }
  };

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji);
    onClose();
  };

  const categoryIcons = {
    standard: '😀',
    love: '😍',
    playful: '😋',
    neutral: '😐',
    smirks: '😏',
    medical: '😷',
    shock: '😵',
    cool: '😎',
    confused: '😕',
    angry: '😤',
    monsters: '👹',
    body: '👁️',
    hearts: '❤️'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="emoji-popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            className="emoji-popup"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 500 }}
          >
            {/* Header */}
            <div className="emoji-popup-header">
              <h3>Emoji Picker</h3>
              <motion.button
                className="emoji-popup-close"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX size={18} />
              </motion.button>
            </div>

            {/* Categories */}
            <div className="emoji-categories">
              {Object.entries(emojiCategories).map(([key, category]) => (
                <motion.button
                  key={key}
                  className={`emoji-category-btn ${activeCategory === key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={category.name}
                >
                  {categoryIcons[key]}
                </motion.button>
              ))}
            </div>

            {/* Emoji Grid */}
            <div className="emoji-grid">
              {emojiCategories[activeCategory]?.emojis.map((emoji, index) => (
                <motion.button
                  key={emoji.name}
                  className="emoji-button"
                  onClick={() => handleEmojiClick(emoji)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  title={emoji.name.replace('_', ' ')}
                >
                  <img src={emoji.image} alt={emoji.name} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
