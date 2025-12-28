import React from 'react';

// Emoji mapping from names to PNG image paths
const emojiImageMap = {
  // Standard Faces
  'grinning_face': '/emojis/grinning_face_3d.png',
  'grinning_face_big_eyes': '/emojis/grinning_face_with_big_eyes_3d.png',
  'grinning_face_smiling_eyes': '/emojis/grinning_face_with_smiling_eyes_3d.png',
  'beaming_face_smiling_eyes': '/emojis/beaming_face_with_smiling_eyes_3d.png',
  'grinning_squinting_face': '/emojis/grinning_squinting_face_3d.png',
  'grinning_face_sweat': '/emojis/grinning_face_with_sweat_3d.png',
  'face_tears_joy': '/emojis/face_with_tears_of_joy_3d.png',
  'rolling_floor_laughing': '/emojis/rolling_on_the_floor_laughing_3d (1).png',
  'slightly_smiling_face': '/emojis/slightly_smiling_face_3d.png',
  'upside_down_face': '/emojis/upside-down_face_3d (1).png',
  'winking_face': '/emojis/winking_face_3d.png',
  'smiling_face_smiling_eyes': '/emojis/smiling_face_with_smiling_eyes_3d.png',
  'smiling_face_halo': '/emojis/smiling_face_with_halo_3d.png',

  // Love / Hearts
  'smiling_face_hearts': '/emojis/smiling_face_with_hearts_3d.png',
  'smiling_face_heart_eyes': '/emojis/smiling_face_with_heart-eyes_3d (1).png',
  'star_struck': '/emojis/star-struck_3d.png',
  'face_blowing_kiss': '/emojis/face_blowing_a_kiss_3d.png',
  'kissing_face': '/emojis/kissing_face_3d.png',
  'smiling_face': '/emojis/smiling_face_3d.png',
  'kissing_face_closed_eyes': '/emojis/kissing_face_with_closed_eyes_3d.png',
  'kissing_face_smiling_eyes': '/emojis/kissing_face_with_smiling_eyes_3d.png',

  // Food / Playful
  'face_savoring_food': '/emojis/face_savoring_food_3d.png',
  'face_with_tongue': '/emojis/face_with_tongue_3d.png',
  'winking_face_tongue': '/emojis/winking_face_with_tongue_3d.png',
  'zany_face': '/emojis/zany_face_3d.png',
  'squinting_face_tongue': '/emojis/squinting_face_with_tongue_3d.png',

  // Neutral / Meh
  'money_mouth_face': '/emojis/money-mouth_face_3d.png',
  'hugging_face': '/emojis/hugging_face_3d.png',
  'face_hand_mouth': '/emojis/face_with_hand_over_mouth_3d.png',
  'face_open_eyes_hand_mouth': '/emojis/face_with_open_eyes_and_hand_over_mouth_3d.png',
  'face_peeking_eye': '/emojis/face_with_peeking_eye_3d.png',
  'shushing_face': '/emojis/shushing_face_3d.png',
  'thinking_face': '/emojis/thinking_face_3d.png',
  'saluting_face': '/emojis/saluting_face_3d.png',
  'zipper_mouth_face': '/emojis/zipper-mouth_face_3d.png',
  'face_raised_eyebrow': '/emojis/face_with_raised_eyebrow_3d.png',
  'neutral_face': '/emojis/neutral_face_3d.png',
  'expressionless_face': '/emojis/expressionless_face_3d.png',
  'face_without_mouth': '/emojis/face_without_mouth_3d.png',
  'dotted_line_face': '/emojis/dotted_line_face_3d.png',
  'face_in_clouds': '/emojis/face_in_clouds_3d.png',

  // Smirks / Cool
  'smirking_face': '/emojis/smirking_face_3d.png',
  'unamused_face': '/emojis/unamused_face_3d.png',
  'face_rolling_eyes': '/emojis/face_with_rolling_eyes_3d.png',
  'grimacing_face': '/emojis/grimacing_face_3d.png',
  'face_exhaling': '/emojis/face_exhaling_3d.png',
  'relieved_face': '/emojis/relieved_face_3d.png',
  'pensive_face': '/emojis/pensive_face_3d.png',
  'sleepy_face': '/emojis/sleepy_face_3d.png',
  'drooling_face': '/emojis/drooling_face_3d.png',
  'sleeping_face': '/emojis/sleeping_face_3d.png',

  // Sick / Medical
  'face_medical_mask': '/emojis/face_with_medical_mask_3d.png',
  'face_thermometer': '/emojis/face_with_thermometer_3d.png',
  'face_head_bandage': '/emojis/face_with_head-bandage_3d.png',
  'nauseated_face': '/emojis/nauseated_face_3d.png',
  'face_vomiting': '/emojis/face_vomiting_3d.png',
  'sneezing_face': '/emojis/sneezing_face_3d.png',

  // Shock / Dizzy
  'face_spiral_eyes': '/emojis/face_with_spiral_eyes_3d.png',
  'exploding_head': '/emojis/exploding_head_3d.png',

  // Cool / Party
  'partying_face': '/emojis/partying_face_3d.png',
  'disguised_face': '/emojis/disguised_face_3d.png',
  'smiling_face_sunglasses': '/emojis/smiling_face_with_sunglasses_3d (1).png',

  // Confused / Sad
  'nerd_face': '/emojis/nerd_face_3d.png',
  'face_monocle': '/emojis/face_with_monocle_3d.png',
  'confused_face': '/emojis/confused_face_3d.png',
  'face_diagonal_mouth': '/emojis/face_with_diagonal_mouth_3d.png',
  'worried_face': '/emojis/worried_face_3d.png',
  'slightly_frowning_face': '/emojis/slightly_frowning_face_3d.png',
  'frowning_face': '/emojis/frowning_face_3d.png',
  'face_open_mouth': '/emojis/face_with_open_mouth_3d.png',
  'hushed_face': '/emojis/hushed_face_3d.png',
  'astonished_face': '/emojis/astonished_face_3d.png',
  'flushed_face': '/emojis/flushed_face_3d.png',
  'pleading_face': '/emojis/pleading_face_3d.png',
  'frowning_face_open_mouth': '/emojis/frowning_face_with_open_mouth_3d.png',
  'anguished_face': '/emojis/anguished_face_3d.png',
  'fearful_face': '/emojis/fearful_face_3d.png',
  'anxious_face_sweat': '/emojis/anxious_face_with_sweat_3d.png',
  'sad_but_relieved_face': '/emojis/sad_but_relieved_face_3d.png',
  'crying_face': '/emojis/crying_face_3d.png',
  'loudly_crying_face': '/emojis/loudly_crying_face_3d.png',

  // Angry / Aggressive
  'face_screaming_fear': '/emojis/face_screaming_in_fear_3d.png',
  'confounded_face': '/emojis/confounded_face_3d.png',
  'persevering_face': '/emojis/persevering_face_3d.png',
  'disappointed_face': '/emojis/disappointed_face_3d.png',
  'downcast_face_sweat': '/emojis/downcast_face_with_sweat_3d.png',
  'weary_face': '/emojis/weary_face_3d.png',
  'tired_face': '/emojis/tired_face_3d.png',
  'yawning_face': '/emojis/yawning_face_3d.png',
  'face_steam_nose': '/emojis/face_with_steam_from_nose_3d.png',
  'pouting_face': '/emojis/pouting_face_3d.png',
  'angry_face': '/emojis/angry_face_3d.png',

  // Monsters / Horns
  'face_symbols_mouth': '/emojis/face_with_symbols_on_mouth_3d.png',
  'smiling_face_horns': '/emojis/smiling_face_with_horns_3d.png',
  'angry_face_horns': '/emojis/angry_face_with_horns_3d.png',
  'skull': '/emojis/skull_3d.png',
  'skull_crossbones': '/emojis/skull_and_crossbones_3d.png',

  // Eyes / Mouth
  'eye': '/emojis/eye_3d.png',
  'eyes': '/emojis/eyes_3d.png',
  'tongue': '/emojis/tongue_3d.png',
  'mouth': '/emojis/mouth_3d.png',
  'biting_lip': '/emojis/biting_lip_3d.png',

  // Heart & Fire Set
  'red_heart': '/emojis/red_heart_3d.png',
  'broken_heart': '/emojis/broken_heart_3d.png',
  'heart_fire': '/emojis/heart_on_fire_3d.png',
  'beating_heart': '/emojis/beating_heart_3d.png',
  'fire': '/emojis/fire_3d.png'
};

// Unicode to emoji name mapping for easy conversion
const unicodeToEmojiMap = {
  '😀': 'grinning_face',
  '😃': 'grinning_face_big_eyes',
  '😄': 'grinning_face_smiling_eyes',
  '😁': 'beaming_face_smiling_eyes',
  '😆': 'grinning_squinting_face',
  '😅': 'grinning_face_sweat',
  '😂': 'face_tears_joy',
  '🤣': 'rolling_floor_laughing',
  '🙂': 'slightly_smiling_face',
  '🙃': 'upside_down_face',
  '😉': 'winking_face',
  '😊': 'smiling_face_smiling_eyes',
  '😇': 'smiling_face_halo',
  '🥰': 'smiling_face_hearts',
  '😍': 'smiling_face_heart_eyes',
  '🤩': 'star_struck',
  '😘': 'face_blowing_kiss',
  '😗': 'kissing_face',
  '☺️': 'smiling_face',
  '😚': 'kissing_face_closed_eyes',
  '😙': 'kissing_face_smiling_eyes',
  '😋': 'face_savoring_food',
  '😛': 'face_with_tongue',
  '😜': 'winking_face_tongue',
  '🤪': 'zany_face',
  '😝': 'squinting_face_tongue',
  '🤑': 'money_mouth_face',
  '🤗': 'hugging_face',
  '🤭': 'face_hand_mouth',
  '🫢': 'face_open_eyes_hand_mouth',
  '🫣': 'face_peeking_eye',
  '🤫': 'shushing_face',
  '🤔': 'thinking_face',
  '🫡': 'saluting_face',
  '🤐': 'zipper_mouth_face',
  '🤨': 'face_raised_eyebrow',
  '😐': 'neutral_face',
  '😑': 'expressionless_face',
  '😶': 'face_without_mouth',
  '🫥': 'dotted_line_face',
  '😶‍🌫️': 'face_in_clouds',
  '😏': 'smirking_face',
  '😒': 'unamused_face',
  '🙄': 'face_rolling_eyes',
  '😬': 'grimacing_face',
  '😮‍💨': 'face_exhaling',
  '😌': 'relieved_face',
  '😔': 'pensive_face',
  '😪': 'sleepy_face',
  '🤤': 'drooling_face',
  '😴': 'sleeping_face',
  '😷': 'face_medical_mask',
  '🤒': 'face_thermometer',
  '🤕': 'face_head_bandage',
  '🤢': 'nauseated_face',
  '🤮': 'face_vomiting',
  '🤧': 'sneezing_face',
  '😵‍💫': 'face_spiral_eyes',
  '🤯': 'exploding_head',
  '🥳': 'partying_face',
  '🥸': 'disguised_face',
  '😎': 'smiling_face_sunglasses',
  '🤓': 'nerd_face',
  '🧐': 'face_monocle',
  '😕': 'confused_face',
  '🫤': 'face_diagonal_mouth',
  '😟': 'worried_face',
  '🙁': 'slightly_frowning_face',
  '☹️': 'frowning_face',
  '😮': 'face_open_mouth',
  '😯': 'hushed_face',
  '😲': 'astonished_face',
  '😳': 'flushed_face',
  '🥺': 'pleading_face',
  '😦': 'frowning_face_open_mouth',
  '😧': 'anguished_face',
  '😨': 'fearful_face',
  '😰': 'anxious_face_sweat',
  '😥': 'sad_but_relieved_face',
  '😢': 'crying_face',
  '😭': 'loudly_crying_face',
  '😱': 'face_screaming_fear',
  '😖': 'confounded_face',
  '😣': 'persevering_face',
  '😞': 'disappointed_face',
  '😓': 'downcast_face_sweat',
  '😩': 'weary_face',
  '😫': 'tired_face',
  '🥱': 'yawning_face',
  '😤': 'face_steam_nose',
  '😡': 'pouting_face',
  '😠': 'angry_face',
  '🤬': 'face_symbols_mouth',
  '😈': 'smiling_face_horns',
  '👿': 'angry_face_horns',
  '💀': 'skull',
  '☠️': 'skull_crossbones',
  '👁️': 'eye',
  '👀': 'eyes',
  '👅': 'tongue',
  '👄': 'mouth',
  '🫦': 'biting_lip',
  '❤️': 'red_heart',
  '💔': 'broken_heart',
  '❤️‍🔥': 'heart_fire',
  '💓': 'beating_heart',
  '🔥': 'fire'
};

// Individual Emoji Component
export const EmojiImage = ({ emojiName, size = 24, className = '', alt = '' }) => {
  const imagePath = emojiImageMap[emojiName];
  
  if (!imagePath) {
    return null;
  }

  return (
    <img 
      src={imagePath} 
      alt={alt || emojiName.replace('_', ' ')}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        display: 'inline-block',
        verticalAlign: 'middle'
      }}
      className={className}
    />
  );
};

// Message Text Renderer - Converts Unicode emojis to PNG images
export const MessageTextRenderer = ({ text, className = '' }) => {
  if (!text) return null;

  // Split text by emojis while preserving the emoji characters
  const parts = [];
  let lastIndex = 0;
  
  // Create regex to match all Unicode emojis
  const emojiRegex = /[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/gu;
  
  let match;
  while ((match = emojiRegex.exec(text)) !== null) {
    // Add text before emoji
    if (match.index > lastIndex) {
      parts.push(
        <span key={lastIndex} className={className}>
          {text.slice(lastIndex, match.index)}
        </span>
      );
    }
    
    // Add emoji as PNG image
    const emoji = match[0];
    const emojiName = unicodeToEmojiMap[emoji];
    
    if (emojiName && emojiImageMap[emojiName]) {
      parts.push(
        <EmojiImage 
          key={match.index} 
          emojiName={emojiName} 
          size={24}
          className="message-emoji"
          alt={emoji}
        />
      );
    } else {
      // Fallback to original emoji if not found in our map
      parts.push(
        <span key={match.index} className={className}>
          {emoji}
        </span>
      );
    }
    
    lastIndex = match.index + emoji.length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={lastIndex} className={className}>
        {text.slice(lastIndex)}
      </span>
    );
  }
  
  return <>{parts}</>;
};

// Convert emoji name to display image
export const renderEmoji = (emojiName, size = 24, className = '') => {
  return <EmojiImage emojiName={emojiName} size={size} className={className} alt={emojiName} />;
};

// Get emoji image path by name
export const getEmojiImagePath = (emojiName) => {
  return emojiImageMap[emojiName] || null;
};

// Get emoji name from Unicode
export const getEmojiNameFromUnicode = (unicode) => {
  return unicodeToEmojiMap[unicode] || null;
};

// Check if emoji exists in our image map
export const hasEmojiImage = (emojiName) => {
  return emojiName in emojiImageMap;
};

export default EmojiImage;
