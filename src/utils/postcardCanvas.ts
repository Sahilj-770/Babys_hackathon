export interface PostcardExportData {
  title: string;
  worldName: string;
  companionName: string;
  feelingName: string;
  story: string;
  frequency: string;
  timestamp: string;
  colors: [string, string, string, string];
}

/**
 * Wraps text into lines that fit within a maximum width on the canvas.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Generates an archival 1200x750 bedtime dream postcard as a high-resolution PNG data URL.
 */
export async function generatePostcardDataUrl(data: PostcardExportData): Promise<string> {
  const width = 1200;
  const height = 750;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // 1. Warm vintage parchment background
  const bgGrad = ctx.createRadialGradient(
    width / 2,
    height / 2,
    50,
    width / 2,
    height / 2,
    width / 1.4
  );
  bgGrad.addColorStop(0, '#fefbf6');
  bgGrad.addColorStop(0.7, '#f7eee1');
  bgGrad.addColorStop(1, '#ebe0cf');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Vintage Double Border
  ctx.strokeStyle = '#5c4033';
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  ctx.strokeStyle = '#ffd88a';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // Corner decorative flourishes
  ctx.fillStyle = '#9e2a2b';
  ctx.font = 'bold 20px serif';
  ctx.fillText('✦', 45, 56);
  ctx.fillText('✦', width - 60, 56);
  ctx.fillText('✦', 45, height - 44);
  ctx.fillText('✦', width - 60, height - 44);

  // 3. Central Vertical Airmail Divider
  ctx.strokeStyle = '#c4b5a0';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(width * 0.54, 60);
  ctx.lineTo(width * 0.54, height - 60);
  ctx.stroke();
  ctx.setLineDash([]); // Reset line dash

  // 4. TOP RIGHT: Pip's Official Postage Stamp
  const stampX = width - 210;
  const stampY = 56;
  const stampW = 145;
  const stampH = 175;

  // Stamp perforated background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(stampX, stampY, stampW, stampH);
  ctx.strokeStyle = '#9e2a2b';
  ctx.lineWidth = 2;
  ctx.strokeRect(stampX + 4, stampY + 4, stampW - 8, stampH - 8);

  // Stamp inner artwork / emblem
  ctx.fillStyle = '#2b1f3d';
  ctx.fillRect(stampX + 10, stampY + 10, stampW - 20, stampH - 45);

  ctx.fillStyle = '#ffd88a';
  ctx.font = 'bold 36px serif';
  ctx.textAlign = 'center';
  ctx.fillText('☾', stampX + stampW / 2, stampY + 62);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('PIP // 432 Hz', stampX + stampW / 2, stampY + 100);

  ctx.fillStyle = '#9e2a2b';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('AIR MAIL 1999', stampX + stampW / 2, stampY + 158);

  // Circular cancellation postmark stamp
  ctx.strokeStyle = 'rgba(92, 64, 51, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(stampX - 20, stampY + 70, 48, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = 'rgba(92, 64, 51, 0.6)';
  ctx.fillText('MIDNIGHT NURSERY', stampX - 20, stampY + 64);
  ctx.fillText(data.timestamp.toUpperCase(), stampX - 20, stampY + 78);

  // 5. LEFT HALF: Message & Dream Story
  ctx.textAlign = 'left';

  // Subtitle / Station Header
  ctx.fillStyle = '#9e2a2b';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('✦ DREAMOS ’99 BEDTIME POSTCARD ✦', 65, 80);

  // Dream Title
  ctx.fillStyle = '#2b1f3d';
  ctx.font = 'bold italic 34px "Playfair Display", Georgia, serif';
  ctx.fillText(`“${data.title}”`, 65, 130);

  // Meta pills: Realm • Ally • Resonance
  ctx.fillStyle = '#5c4033';
  ctx.font = 'bold 13px monospace';
  ctx.fillText(
    `REALM: ${data.worldName.toUpperCase()}   •   ALLY: ${data.companionName.toUpperCase()}`,
    65,
    168
  );

  ctx.fillStyle = '#ffd88a';
  ctx.fillRect(65, 180, 480, 2);

  // Poetic bedtime story vignette
  ctx.fillStyle = '#34221a';
  ctx.font = 'italic 19px Georgia, serif';
  const storyLines = wrapText(ctx, data.story, 490);
  let lineY = 222;
  for (const line of storyLines.slice(0, 9)) {
    ctx.fillText(line, 65, lineY);
    lineY += 28;
  }

  // Solfeggio frequency stamp on bottom-left
  ctx.fillStyle = '#9e2a2b';
  ctx.font = 'bold 12px monospace';
  ctx.fillText(
    `RESONANCE: ${data.feelingName.toUpperCase()}   |   CALIBRATED: ${data.frequency}`,
    65,
    height - 75
  );

  ctx.fillStyle = '#7a6b5e';
  ctx.font = 'italic 13px Georgia, serif';
  ctx.fillText('— Hand-crafted by Pip, Junior Dream Engineer', 65, height - 52);

  // 6. RIGHT HALF: Airmail Address Lines
  const addrX = width * 0.58;
  let addrY = 280;

  ctx.fillStyle = '#5c4033';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('DELIVER TO:', addrX, addrY);

  addrY += 45;
  const recipientFields = [
    'The Sweet Dreamer',
    'Room of Gentle Whispers, Crib No. 01',
    'Clover Cottage, Sleepy Rooftops',
    'Midnight Nursery // Starlight Realm'
  ];

  for (const field of recipientFields) {
    ctx.fillStyle = '#2b1f3d';
    ctx.font = 'italic 20px Georgia, serif';
    ctx.fillText(field, addrX, addrY);

    ctx.strokeStyle = '#c4b5a0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(addrX, addrY + 8);
    ctx.lineTo(width - 65, addrY + 8);
    ctx.stroke();

    addrY += 54;
  }

  // Bottom right canon stamp
  ctx.fillStyle = '#9e2a2b';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('DREAM ENGINE SPEC // NO. 01', width - 65, height - 52);

  return canvas.toDataURL('image/png');
}

/**
 * Downloads a data URL as a file in the browser.
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
