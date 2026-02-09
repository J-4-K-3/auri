import React from 'react';

// Emoji mapping from names to PNG image paths
// Keys include _3d suffix to match what Chatbot.jsx sends
const emojiImageMap = {
  // Standard Faces with _3d suffix
  'grinning_face_3d': '/emojis/grinning_face_3d.png',
  'grinning_face_with_big_eyes_3d': '/emojis/grinning_face_with_big_eyes_3d.png',
  'grinning_face_with_smiling_eyes_3d': '/emojis/grinning_face_with_smiling_eyes_3d.png',
  'beaming_face_with_smiling_eyes_3d': '/emojis/beaming_face_with_smiling_eyes_3d.png',
  'grinning_squinting_face_3d': '/emojis/grinning_squinting_face_3d.png',
  'grinning_face_with_sweat_3d': '/emojis/grinning_face_with_sweat_3d.png',
  'face_with_tears_of_joy_3d': '/emojis/face_with_tears_of_joy_3d.png',
  'rolling_on_the_floor_laughing_3d': '/emojis/rolling_on_the_floor_laughing_3d (1).png',
  'slightly_smiling_face_3d': '/emojis/slightly_smiling_face_3d.png',
  'upside-down_face_3d': '/emojis/upside-down_face_3d (1).png',
  'winking_face_3d': '/emojis/winking_face_3d.png',
  'smiling_face_with_smiling_eyes_3d': '/emojis/smiling_face_with_smiling_eyes_3d.png',
  'smiling_face_with_halo_3d': '/emojis/smiling_face_with_halo_3d.png',

  // Love / Hearts with _3d suffix
  'smiling_face_with_hearts_3d': '/emojis/smiling_face_with_hearts_3d.png',
  'smiling_face_with_heart-eyes_3d': '/emojis/smiling_face_with_heart-eyes_3d (1).png',
  'star-struck_3d': '/emojis/star-struck_3d.png',
  'face_blowing_a_kiss_3d': '/emojis/face_blowing_a_kiss_3d.png',
  'kissing_face_3d': '/emojis/kissing_face_3d.png',
  'smiling_face_3d': '/emojis/smiling_face_3d.png',
  'kissing_face_with_closed_eyes_3d': '/emojis/kissing_face_with_closed_eyes_3d.png',
  'kissing_face_with_smiling_eyes_3d': '/emojis/kissing_face_with_smiling_eyes_3d.png',

  // Food / Playful with _3d suffix
  'face_savoring_food_3d': '/emojis/face_savoring_food_3d.png',
  'face_with_tongue_3d': '/emojis/face_with_tongue_3d.png',
  'winking_face_with_tongue_3d': '/emojis/winking_face_with_tongue_3d.png',
  'zany_face_3d': '/emojis/zany_face_3d.png',
  'squinting_face_with_tongue_3d': '/emojis/squinting_face_with_tongue_3d.png',

  // Neutral / Meh with _3d suffix
  'money-mouth_face_3d': '/emojis/money-mouth_face_3d.png',
  'hugging_face_3d': '/emojis/hugging_face_3d.png',
  'face_with_hand_over_mouth_3d': '/emojis/face_with_hand_over_mouth_3d.png',
  'face_with_open_eyes_and_hand_over_mouth_3d': '/emojis/face_with_open_eyes_and_hand_over_mouth_3d.png',
  'face_with_peeking_eye_3d': '/emojis/face_with_peeking_eye_3d.png',
  'shushing_face_3d': '/emojis/shushing_face_3d.png',
  'thinking_face_3d': '/emojis/thinking_face_3d.png',
  'saluting_face_3d': '/emojis/saluting_face_3d.png',
  'zipper-mouth_face_3d': '/emojis/zipper-mouth_face_3d.png',
  'face_with_raised_eyebrow_3d': '/emojis/face_with_raised_eyebrow_3d.png',
  'neutral_face_3d': '/emojis/neutral_face_3d.png',
  'expressionless_face_3d': '/emojis/expressionless_face_3d.png',
  'face_without_mouth_3d': '/emojis/face_without_mouth_3d.png',
  'dotted_line_face_3d': '/emojis/dotted_line_face_3d.png',
  'face_in_clouds_3d': '/emojis/face_in_clouds_3d.png',

  // Smirks / Cool with _3d suffix
  'smirking_face_3d': '/emojis/smirking_face_3d.png',
  'unamused_face_3d': '/emojis/unamused_face_3d.png',
  'face_with_rolling_eyes_3d': '/emojis/face_with_rolling_eyes_3d.png',
  'grimacing_face_3d': '/emojis/grimacing_face_3d.png',
  'face_exhaling_3d': '/emojis/face_exhaling_3d.png',
  'relieved_face_3d': '/emojis/relieved_face_3d.png',
  'pensive_face_3d': '/emojis/pensive_face_3d.png',
  'sleepy_face_3d': '/emojis/sleepy_face_3d.png',
  'drooling_face_3d': '/emojis/drooling_face_3d.png',
  'sleeping_face_3d': '/emojis/sleeping_face_3d.png',

  // Sick / Medical with _3d suffix
  'face_with_medical_mask_3d': '/emojis/face_with_medical_mask_3d.png',
  'face_with_thermometer_3d': '/emojis/face_with_thermometer_3d.png',
  'face_with_head-bandage_3d': '/emojis/face_with_head-bandage_3d.png',
  'nauseated_face_3d': '/emojis/nauseated_face_3d.png',
  'face_vomiting_3d': '/emojis/face_vomiting_3d.png',
  'sneezing_face_3d': '/emojis/sneezing_face_3d.png',

  // Shock / Dizzy with _3d suffix
  'face_with_spiral_eyes_3d': '/emojis/face_with_spiral_eyes_3d.png',
  'exploding_head_3d': '/emojis/exploding_head_3d.png',

  // Cool / Party with _3d suffix
  'partying_face_3d': '/emojis/partying_face_3d.png',
  'disguised_face_3d': '/emojis/disguised_face_3d.png',
  'smiling_face_with_sunglasses_3d': '/emojis/smiling_face_with_sunglasses_3d (1).png',

  // Confused / Sad with _3d suffix
  'nerd_face_3d': '/emojis/nerd_face_3d.png',
  'face_with_monocle_3d': '/emojis/face_with_monocle_3d.png',
  'confused_face_3d': '/emojis/confused_face_3d.png',
  'face_with_diagonal_mouth_3d': '/emojis/face_with_diagonal_mouth_3d.png',
  'worried_face_3d': '/emojis/worried_face_3d.png',
  'slightly_frowning_face_3d': '/emojis/slightly_frowning_face_3d.png',
  'frowning_face_3d': '/emojis/frowning_face_3d.png',
  'face_with_open_mouth_3d': '/emojis/face_with_open_mouth_3d.png',
  'hushed_face_3d': '/emojis/hushed_face_3d.png',
  'astonished_face_3d': '/emojis/astonished_face_3d.png',
  'flushed_face_3d': '/emojis/flushed_face_3d.png',
  'pleading_face_3d': '/emojis/pleading_face_3d.png',
  'frowning_face_with_open_mouth_3d': '/emojis/frowning_face_with_open_mouth_3d.png',
  'anguished_face_3d': '/emojis/anguished_face_3d.png',
  'fearful_face_3d': '/emojis/fearful_face_3d.png',
  'anxious_face_with_sweat_3d': '/emojis/anxious_face_with_sweat_3d.png',
  'sad_but_relieved_face_3d': '/emojis/sad_but_relieved_face_3d.png',
  'crying_face_3d': '/emojis/crying_face_3d.png',
  'loudly_crying_face_3d': '/emojis/loudly_crying_face_3d.png',

  // Angry / Aggressive with _3d suffix
  'face_screaming_in_fear_3d': '/emojis/face_screaming_in_fear_3d.png',
  'confounded_face_3d': '/emojis/confounded_face_3d.png',
  'persevering_face_3d': '/emojis/persevering_face_3d.png',
  'disappointed_face_3d': '/emojis/disappointed_face_3d.png',
  'downcast_face_with_sweat_3d': '/emojis/downcast_face_with_sweat_3d.png',
  'weary_face_3d': '/emojis/weary_face_3d.png',
  'tired_face_3d': '/emojis/tired_face_3d.png',
  'yawning_face_3d': '/emojis/yawning_face_3d.png',
  'face_with_steam_from_nose_3d': '/emojis/face_with_steam_from_nose_3d.png',
  'pouting_face_3d': '/emojis/pouting_face_3d.png',
  'angry_face_3d': '/emojis/angry_face_3d.png',

  // Monsters / Horns with _3d suffix
  'face_with_symbols_on_mouth_3d': '/emojis/face_with_symbols_on_mouth_3d.png',
  'smiling_face_with_horns_3d': '/emojis/smiling_face_with_horns_3d.png',
  'angry_face_with_horns_3d': '/emojis/angry_face_with_horns_3d.png',
  'skull_3d': '/emojis/skull_3d.png',
  'skull_and_crossbones_3d': '/emojis/skull_and_crossbones_3d.png',

  // Eyes / Mouth with _3d suffix
  'eye_3d': '/emojis/eye_3d.png',
  'eyes_3d': '/emojis/eyes_3d.png',
  'tongue_3d': '/emojis/tongue_3d.png',
  'mouth_3d': '/emojis/mouth_3d.png',
  'biting_lip_3d': '/emojis/biting_lip_3d.png',

  // Heart & Fire Set with _3d suffix
  'red_heart_3d': '/emojis/red_heart_3d.png',
  'broken_heart_3d': '/emojis/broken_heart_3d.png',
  'heart_on_fire_3d': '/emojis/heart_on_fire_3d.png',
  'beating_heart_3d': '/emojis/beating_heart_3d.png',
  'fire_3d': '/emojis/fire_3d.png',
};

// Legacy map without _3d suffix for backward compatibility
const emojiImageMapLegacy = {
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
  'smiling_face_hearts': '/emojis/smiling_face_with_hearts_3d.png',
  'smiling_face_heart_eyes': '/emojis/smiling_face_with_heart-eyes_3d (1).png',
  'star_struck': '/emojis/star-struck_3d.png',
  'face_blowing_kiss': '/emojis/face_blowing_a_kiss_3d.png',
  'kissing_face': '/emojis/kissing_face_3d.png',
  'smiling_face': '/emojis/smiling_face_3d.png',
  'kissing_face_closed_eyes': '/emojis/kissing_face_with_closed_eyes_3d.png',
  'kissing_face_smiling_eyes': '/emojis/kissing_face_with_smiling_eyes_3d.png',
  'face_savoring_food': '/emojis/face_savoring_food_3d.png',
  'face_with_tongue': '/emojis/face_with_tongue_3d.png',
  'winking_face_tongue': '/emojis/winking_face_with_tongue_3d.png',
  'zany_face': '/emojis/zany_face_3d.png',
  'squinting_face_tongue': '/emojis/squinting_face_with_tongue_3d.png',
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
  'face_medical_mask': '/emojis/face_with_medical_mask_3d.png',
  'face_thermometer': '/emojis/face_with_thermometer_3d.png',
  'face_head_bandage': '/emojis/face_with_head-bandage_3d.png',
  'nauseated_face': '/emojis/nauseated_face_3d.png',
  'face_vomiting': '/emojis/face_vomiting_3d.png',
  'sneezing_face': '/emojis/sneezing_face_3d.png',
  'face_spiral_eyes': '/emojis/face_with_spiral_eyes_3d.png',
  'exploding_head': '/emojis/exploding_head_3d.png',
  'partying_face': '/emojis/partying_face_3d.png',
  'disguised_face': '/emojis/disguised_face_3d.png',
  'smiling_face_sunglasses': '/emojis/smiling_face_with_sunglasses_3d (1).png',
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
  'face_symbols_mouth': '/emojis/face_with_symbols_on_mouth_3d.png',
  'smiling_face_horns': '/emojis/smiling_face_with_horns_3d.png',
  'angry_face_horns': '/emojis/angry_face_with_horns_3d.png',
  'skull': '/emojis/skull_3d.png',
  'skull_crossbones': '/emojis/skull_and_crossbones_3d.png',
  'eye': '/emojis/eye_3d.png',
  'eyes': '/emojis/eyes_3d.png',
  'tongue': '/emojis/tongue_3d.png',
  'mouth': '/emojis/mouth_3d.png',
  'biting_lip': '/emojis/biting_lip_3d.png',
  'red_heart': '/emojis/red_heart_3d.png',
  'broken_heart': '/emojis/broken_heart_3d.png',
  'heart_fire': '/emojis/heart_on_fire_3d.png',
  'beating_heart': '/emojis/beating_heart_3d.png',
  'fire': '/emojis/fire_3d.png',
};

// Unicode to emoji name mapping for easy conversion
const unicodeToEmojiMap = {
  '😀': 'grinning_face_3d',
  '😃': 'grinning_face_with_big_eyes_3d',
  '😄': 'grinning_face_with_smiling_eyes_3d',
  '😁': 'beaming_face_with_smiling_eyes_3d',
  '😆': 'grinning_squinting_face_3d',
  '😅': 'grinning_face_with_sweat_3d',
  '😂': 'face_with_tears_of_joy_3d',
  '🤣': 'rolling_on_the_floor_laughing_3d',
  '🙂': 'slightly_smiling_face_3d',
  '🙃': 'upside-down_face_3d',
  '😉': 'winking_face_3d',
  '😊': 'smiling_face_with_smiling_eyes_3d',
  '😇': 'smiling_face_with_halo_3d',
  '🥰': 'smiling_face_with_hearts_3d',
  '😍': 'smiling_face_with_heart-eyes_3d',
  '🤩': 'star-struck_3d',
  '😘': 'face_blowing_a_kiss_3d',
  '😗': 'kissing_face_3d',
  '☺️': 'smiling_face_3d',
  '😚': 'kissing_face_with_closed_eyes_3d',
  '😙': 'kissing_face_with_smiling_eyes_3d',
  '😋': 'face_savoring_food_3d',
  '😛': 'face_with_tongue_3d',
  '😜': 'winking_face_with_tongue_3d',
  '🤪': 'zany_face_3d',
  '😝': 'squinting_face_with_tongue_3d',
  '🤑': 'money-mouth_face_3d',
  '🤗': 'hugging_face_3d',
  '🤭': 'face_with_hand_over_mouth_3d',
  '🫢': 'face_with_open_eyes_and_hand_over_mouth_3d',
  '🫣': 'face_with_peeking_eye_3d',
  '🤫': 'shushing_face_3d',
  '🤔': 'thinking_face_3d',
  '🫡': 'saluting_face_3d',
  '🤐': 'zipper-mouth_face_3d',
  '🤨': 'face_with_raised_eyebrow_3d',
  '😐': 'neutral_face_3d',
  '😑': 'expressionless_face_3d',
  '😶': 'face_without_mouth_3d',
  '🫥': 'dotted_line_face_3d',
  '😶‍🌫️': 'face_in_clouds_3d',
  '😏': 'smirking_face_3d',
  '😒': 'unamused_face_3d',
  '🙄': 'face_with_rolling_eyes_3d',
  '😬': 'grimacing_face_3d',
  '😮‍💨': 'face_exhaling_3d',
  '😌': 'relieved_face_3d',
  '😔': 'pensive_face_3d',
  '😪': 'sleepy_face_3d',
  '🤤': 'drooling_face_3d',
  '😴': 'sleeping_face_3d',
  '😷': 'face_with_medical_mask_3d',
  '🤒': 'face_with_thermometer_3d',
  '🤕': 'face_with_head-bandage_3d',
  '🤢': 'nauseated_face_3d',
  '🤮': 'face_vomiting_3d',
  '🤧': 'sneezing_face_3d',
  '😵‍💫': 'face_with_spiral_eyes_3d',
  '🤯': 'exploding_head_3d',
  '🥳': 'partying_face_3d',
  '🥸': 'disguised_face_3d',
  '😎': 'smiling_face_with_sunglasses_3d',
  '🤓': 'nerd_face_3d',
  '🧐': 'face_with_monocle_3d',
  '😕': 'confused_face_3d',
  '🫤': 'face_with_diagonal_mouth_3d',
  '😟': 'worried_face_3d',
  '🙁': 'slightly_frowning_face_3d',
  '☹️': 'frowning_face_3d',
  '😮': 'face_with_open_mouth_3d',
  '😯': 'hushed_face_3d',
  '😲': 'astonished_face_3d',
  '😳': 'flushed_face_3d',
  '🥺': 'pleading_face_3d',
  '😦': 'frowning_face_with_open_mouth_3d',
  '😧': 'anguished_face_3d',
  '😨': 'fearful_face_3d',
  '😰': 'anxious_face_with_sweat_3d',
  '😥': 'sad_but_relieved_face_3d',
  '😢': 'crying_face_3d',
  '😭': 'loudly_crying_face_3d',
  '😱': 'face_screaming_in_fear_3d',
  '😖': 'confounded_face_3d',
  '😣': 'persevering_face_3d',
  '😞': 'disappointed_face_3d',
  '😓': 'downcast_face_with_sweat_3d',
  '😩': 'weary_face_3d',
  '😫': 'tired_face_3d',
  '🥱': 'yawning_face_3d',
  '😤': 'face_with_steam_from_nose_3d',
  '😡': 'pouting_face_3d',
  '😠': 'angry_face_3d',
  '🤬': 'face_with_symbols_on_mouth_3d',
  '😈': 'smiling_face_with_horns_3d',
  '👿': 'angry_face_with_horns_3d',
  '💀': 'skull_3d',
  '☠️': 'skull_and_crossbones_3d',
  '👁️': 'eye_3d',
  '👀': 'eyes_3d',
  '👅': 'tongue_3d',
  '👄': 'mouth_3d',
  '🫦': 'biting_lip_3d',
  '❤️': 'red_heart_3d',
  '💔': 'broken_heart_3d',
  '❤️‍🔥': 'heart_on_fire_3d',
  '💓': 'beating_heart_3d',
  '🔥': 'fire_3d',
};

// Helper function to get emoji image path - handles both with and without _3d suffix
const getEmojiImagePath = (emojiName) => {
  if (!emojiName) return null;
  
  // Try exact match first
  if (emojiImageMap[emojiName]) {
    return emojiImageMap[emojiName];
  }
  
  // Try adding _3d suffix if not present
  if (!emojiName.endsWith('_3d')) {
    const with3d = `${emojiName}_3d`;
    if (emojiImageMap[with3d]) {
      return emojiImageMap[with3d];
    }
  }
  
  // Try legacy map
  if (emojiImageMapLegacy[emojiName]) {
    return emojiImageMapLegacy[emojiName];
  }
  
  // Try removing _3d and check legacy
  if (emojiName.endsWith('_3d')) {
    const without3d = emojiName.replace(/_3d$/, '');
    if (emojiImageMapLegacy[without3d]) {
      return emojiImageMapLegacy[without3d];
    }
  }
  
  return null;
};

// Individual Emoji Component
export const EmojiImage = ({ emojiName, size = 24, className = '', alt = '' }) => {
  const imagePath = getEmojiImagePath(emojiName);
  
  if (!imagePath) {
    return null;
  }

  return (
    <img 
      src={imagePath} 
      alt={alt || (emojiName ? emojiName.replace(/_/g, ' ').replace(' 3d', '') : '')}
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

// Message Text Renderer - Converts Unicode emojis to PNG images and optionally displays a large emoji above
export const MessageTextRenderer = ({ text, className = '', emoji = null, emojiSize = 48 }) => {
  if (!text) return null;

  // If an emoji is provided, render it as a large image above the message
  const emojiImage = emoji ? (
    <div className="message-emoji-above" style={{ marginBottom: '8px' }}>
      <EmojiImage 
        emojiName={emoji}
        size={emojiSize}
        className="message-emoji-image"
        alt={emoji.replace(/_/g, ' ')}
      />
    </div>
  ) : null;

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
        <span key={`text-${lastIndex}`} className={className}>
          {text.slice(lastIndex, match.index)}
        </span>
      );
    }
    
    // Add emoji as PNG image
    const emoji = match[0];
    const emojiName = unicodeToEmojiMap[emoji];
    
    if (emojiName) {
      const imagePath = getEmojiImagePath(emojiName);
      if (imagePath) {
        parts.push(
          <EmojiImage 
            key={`emoji-${match.index}`}
            emojiName={emojiName}
            size={24}
            className="message-emoji"
            alt={emoji}
          />
        );
      } else {
        // Fallback to original emoji if not found in our map
        parts.push(
          <span key={`fallback-${match.index}`} className={className}>
            {emoji}
          </span>
        );
      }
    } else {
      // Fallback to original emoji if not in unicode map
      parts.push(
        <span key={`unicode-${match.index}`} className={className}>
          {emoji}
        </span>
      );
    }
    
    lastIndex = match.index + emoji.length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-end-${lastIndex}`} className={className}>
        {text.slice(lastIndex)}
      </span>
    );
  }
  
  return (
    <>
      {emojiImage}
      <>{parts}</>
    </>
  );
};

// Convert emoji name to display image
export const renderEmoji = (emojiName, size = 24, className = '') => {
  return <EmojiImage emojiName={emojiName} size={size} className={className} alt={emojiName} />;
};

// Get emoji image path by name
export const getEmojiImagePathByName = (emojiName) => {
  return getEmojiImagePath(emojiName);
};

// Get emoji name from Unicode
export const getEmojiNameFromUnicode = (unicode) => {
  return unicodeToEmojiMap[unicode] || null;
};

// Check if emoji exists in our image map
export const hasEmojiImage = (emojiName) => {
  return getEmojiImagePath(emojiName) !== null;
};

export default EmojiImage;

