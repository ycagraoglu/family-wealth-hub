// Brand logos using official logo URLs
export const brandLogos: Record<string, string> = {
  // Streaming & Entertainment
  'netflix': 'https://images.ctfassets.net/y2ske730sjqp/1aONibCke6niZhgPxuiilC/2c401b05a07288746ddf3bd1236f7ced/BrandAssets_Logos_02-NSymbol.jpg',
  'spotify': 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png',
  'youtube': 'https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg',
  'youtube premium': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/YouTube_Premium_logo.svg/250px-YouTube_Premium_logo.svg.png',
  'disney+': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/320px-Disney%2B_logo.svg.png',
  'hbo max': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/HBO_Max_Logo.svg/320px-HBO_Max_Logo.svg.png',
  'apple tv+': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Apple_TV_Plus_Logo.svg/320px-Apple_TV_Plus_Logo.svg.png',
  'prime video': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/320px-Amazon_Prime_Video_logo.svg.png',
  
  // Cloud & Tech
  'icloud': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/ICloud_logo.svg/320px-ICloud_logo.svg.png',
  'icloud storage': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/ICloud_logo.svg/320px-ICloud_logo.svg.png',
  'google one': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Google_One_icon.svg/160px-Google_One_icon.svg.png',
  'google drive': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/160px-Google_Drive_icon_%282020%29.svg.png',
  'dropbox': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dropbox_Icon.svg/160px-Dropbox_Icon.svg.png',
  'onedrive': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg/160px-Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg.png',
  
  // Shopping
  'amazon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png',
  'amazon prime': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Amazon_Prime_Logo.svg/320px-Amazon_Prime_Logo.svg.png',
  
  // Gaming
  'xbox game pass': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Xbox_Game_Pass_new_logo_-_colored_version.svg/250px-Xbox_Game_Pass_new_logo_-_colored_version.svg.png',
  'playstation plus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/PlayStation_Plus_logo.svg/320px-PlayStation_Plus_logo.svg.png',
  'nintendo switch online': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Nintendo_Switch_Online_Logo.svg/320px-Nintendo_Switch_Online_Logo.svg.png',
  
  // Productivity
  'microsoft 365': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Microsoft_365_%282022%29.svg/160px-Microsoft_365_%282022%29.svg.png',
  'office 365': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Microsoft_365_%282022%29.svg/160px-Microsoft_365_%282022%29.svg.png',
  'adobe creative cloud': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Adobe_Creative_Cloud_rainbow_icon.svg/160px-Adobe_Creative_Cloud_rainbow_icon.svg.png',
  'notion': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/160px-Notion-logo.svg.png',
  'figma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/160px-Figma-logo.svg.png',
  'canva': 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bb/Canva_Logo.svg/320px-Canva_Logo.svg.png',
  
  // Fitness
  'fitbit': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Fitbit_logo.svg/320px-Fitbit_logo.svg.png',
  'strava': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Strava_Logo.svg/320px-Strava_Logo.svg.png',
  'peloton': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Peloton_logo.svg/320px-Peloton_logo.svg.png',
  
  // Communication
  'zoom': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zoom_Communications_Logo.svg/320px-Zoom_Communications_Logo.svg.png',
  'slack': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/160px-Slack_icon_2019.svg.png',
  'discord': 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png',
};

// Get logo URL for a subscription name
export const getBrandLogo = (name: string): string | null => {
  const normalizedName = name.toLowerCase().trim();
  
  // Direct match
  if (brandLogos[normalizedName]) {
    return brandLogos[normalizedName];
  }
  
  // Partial match
  for (const [brand, url] of Object.entries(brandLogos)) {
    if (normalizedName.includes(brand) || brand.includes(normalizedName)) {
      return url;
    }
  }
  
  return null;
};

// Professional avatars using UI Avatars service (generates clean letter-based avatars)
export const getInitialsAvatar = (name: string, size = 128): string => {
  const colors = ['0ea5e9', '8b5cf6', 'f97316', '10b981', 'ef4444', '3b82f6'];
  const colorIndex = name.charCodeAt(0) % colors.length;
  const bg = colors[colorIndex];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=${bg}&color=fff&bold=true&format=svg`;
};

// Professional photo avatars using randomuser.me style
export const getPhotoAvatar = (seed: string, gender: 'men' | 'women' = 'men'): string => {
  // Using Pravatar for consistent professional photos
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `https://i.pravatar.cc/150?u=${seed}`;
};
