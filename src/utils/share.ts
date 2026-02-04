import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Share match result as image
 */
export const shareMatchAsImage = async (elementId: string, filename: string = 'match-result.png') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], filename, { type: 'image/png' });
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
          navigator.share({
            files: [file],
            title: 'Match Result',
            text: 'Check out my match result!',
          });
        } else {
          // Fallback: download image
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }
    }, 'image/png');
  } catch (error) {
    console.error('Error sharing image:', error);
    alert('Failed to share image. Please try again.');
  }
};

/**
 * Share to social media platforms
 */
export const shareToSocial = (platform: 'twitter' | 'facebook' | 'whatsapp', text: string, url?: string) => {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = url ? encodeURIComponent(url) : '';

  const shareUrls: Record<string, string> = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}${encodedUrl ? `&url=${encodedUrl}` : ''}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl || 'https://racketscore.app'}&quote=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}${encodedUrl ? `%20${encodedUrl}` : ''}`,
  };

  window.open(shareUrls[platform], '_blank', 'width=600,height=400');
};

/**
 * Export match history as CSV
 */
export const exportMatchHistoryAsCSV = (matchHistory: any[]) => {
  const headers = ['Date', 'Time', 'Sport', 'Player 1', 'Player 2', 'Winner', 'Result', 'Duration (min)'];
  const rows = matchHistory.map(match => {
    const date = new Date(match.date);
    return [
      date.toLocaleDateString(),
      date.toLocaleTimeString(),
      match.sport,
      match.player1Name,
      match.player2Name,
      match.winner === 1 ? match.player1Name : match.player2Name,
      match.result,
      Math.floor(match.duration / 60),
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `match-history-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export match history as PDF
 */
export const exportMatchHistoryAsPDF = async (matchHistory: any[]) => {
  try {
    const doc = new jsPDF();
    let y = 20;

    // Title
    doc.setFontSize(18);
    doc.text('Match History', 14, y);
    y += 10;

    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, y);
    y += 15;

    // Table headers
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Date', 14, y);
    doc.text('Sport', 50, y);
    doc.text('Players', 80, y);
    doc.text('Result', 140, y);
    doc.text('Duration', 180, y);
    y += 8;

    // Table rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    matchHistory.forEach((match) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const date = new Date(match.date);
      const dateStr = date.toLocaleDateString();
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const players = `${match.player1Name} vs ${match.player2Name}`;
      const winner = match.winner === 1 ? match.player1Name : match.player2Name;
      const duration = `${Math.floor(match.duration / 60)}:${String(match.duration % 60).padStart(2, '0')}`;

      doc.text(dateStr, 14, y);
      doc.text(timeStr, 14, y + 5);
      doc.text(match.sport, 50, y);
      doc.text(players, 80, y);
      doc.text(`${winner} won`, 140, y);
      doc.text(match.result, 140, y + 5);
      doc.text(duration, 180, y);
      
      y += 15;
    });

    doc.save(`match-history-${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    alert('Failed to export PDF. Please try again.');
  }
};
