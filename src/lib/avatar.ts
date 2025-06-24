
export const generateAvatarURL = (name: string): string => {
  // Usando DiceBear API para gerar avatars baseados no nome
  const encodedName = encodeURIComponent(name);
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}&backgroundColor=random`;
};
