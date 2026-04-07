import { jsPDF } from 'jspdf';

export function generateReport({
  score,
  categoryScores,
  categoryNames,
  capturedData,
  grade,
  insights,
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Color palette
  const navy = [10, 10, 15];
  const amber = [245, 158, 11];
  const white = [255, 255, 255];
  const gray = [148, 163, 184];
  const darkGray = [30, 30, 50];
  const lightGray = [241, 245, 249];
  const green = [34, 197, 94];
  const red = [239, 68, 68];
  const purple = [168, 85, 247];
  const blue = [59, 130, 246];

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const addFooter = (pageNum, totalPages = 5) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    const footerText = `Confidential | Generated ${getCurrentDate()} | Page ${pageNum} of ${totalPages}`;
    doc.text(footerText, margin, pageHeight - 10);
  };

  const addPageBreak = () => {
    doc.addPage();
  };

  // PAGE 1: COVER
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(42);
  doc.setTextColor(...amber);
  doc.text('AI READINESS', pageWidth / 2, 60, { align: 'center' });
  doc.text('REPORT', pageWidth / 2, 105, { align: 'center' });

  // Company name
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(24);
  doc.setTextColor(...white);
  doc.text(capturedData.company || 'Your Company', pageWidth / 2, 140, {
    align: 'center',
  });

  // Score circle
  doc.setFillColor(...amber);
  doc.circle(pageWidth / 2, 180, 25, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(48);
  doc.setTextColor(...navy);
  doc.text(`${score}`, pageWidth / 2, 185, { align: 'center', valign: 'middle' });

  doc.setFontSize(14);
  doc.text('/ 100', pageWidth / 2 + 25, 180, { valign: 'middle' });

  // Grade
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...amber);
  doc.text(grade.label, pageWidth / 2, 220, { align: 'center' });

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...white);
  doc.text('Prepared by', pageWidth / 2, 265, { align: 'center' });
  doc.text('Elios AI Consulting & 33v Product Studio', pageWidth / 2, 272, {
    align: 'center',
  });

  addFooter(1);

  // PAGE 2: EXECUTIVE SUMMARY
  addPageBreak();
  doc.setFillColor(...lightGray);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...amber);
  doc.text('EXECUTIVE SUMMARY', margin, 20);

  let yPos = 45;

  // Overall Score
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...navy);
  doc.text('Overall Score', margin, yPos);

  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...darkGray);
  doc.setFillColor(...white);
  doc.rect(margin, yPos - 5, 30, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...amber);
  doc.text(`${score}/100`, margin + 5, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...darkGray);
  doc.text(grade.label, margin + 40, yPos);
  doc.text(`— ${grade.description}`, margin + 40 + 25, yPos);

  yPos += 25;

  // Maturity Level
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...navy);
  doc.text('Maturity Level', margin, yPos);

  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...darkGray);
  const maturityLevel = insights.maturityLevel || 'Implementing';
  const nextMaturityLevel = getNextMaturityLevel(maturityLevel);
  doc.text(`Current: ${maturityLevel}`, margin, yPos);
  yPos += 6;
  doc.text(`Next Level: ${nextMaturityLevel}`, margin, yPos);

  yPos += 20;

  // Revenue Impact
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...navy);
  doc.text('Revenue Impact', margin, yPos);

  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...darkGray);
  const hoursRecoverable = insights.hoursRecoverable || 0;
  const dollarValue = Math.round(hoursRecoverable * 75);
  doc.text(
    `Estimated ${hoursRecoverable} hours/year recoverable through AI automation`,
    margin,
    yPos,
  );
  yPos += 6;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...amber);
  doc.text(`Potential value: $${dollarValue.toLocaleString()}`, margin, yPos);

  yPos += 20;

  // Key Insight
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...navy);
  doc.text('Key Insight', margin, yPos);

  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...darkGray);
  const keyInsight = insights.keyInsight || '';
  const splitText = doc.splitTextToSize(keyInsight, contentWidth - 10);
  doc.text(splitText, margin + 5, yPos);
  yPos += splitText.length * 5 + 15;

  // What This Means
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...navy);
  doc.text('What This Means', margin, yPos);

  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...darkGray);
  const meaning = getGradeMeaning(grade.label);
  const splitMeaning = doc.splitTextToSize(meaning, contentWidth - 10);
  doc.text(splitMeaning, margin + 5, yPos);

  addFooter(2);

  // PAGE 3: CATEGORY BREAKDOWN
  addPageBreak();
  doc.setFillColor(...lightGray);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...amber);
  doc.text('DETAILED CATEGORY ANALYSIS', margin, 20);

  yPos = 50;
  const categoryBoxHeight = 35;
  const spacing = 10;

  categoryNames.forEach((name, index) => {
    const catScore = categoryScores[index];
    const percentage = Math.round((catScore / 20) * 100);

    // Category name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...navy);
    doc.text(name, margin, yPos);

    // Score
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...amber);
    doc.text(`${catScore}/20`, pageWidth - margin - 40, yPos);

    yPos += 8;

    // Bar background
    doc.setFillColor(230, 230, 240);
    doc.rect(margin, yPos, contentWidth, 8, 'F');

    // Bar fill
    const barWidth = (percentage / 100) * contentWidth;
    doc.setFillColor(...amber);
    doc.rect(margin, yPos, barWidth, 8, 'F');

    // Percentage
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.text(`${percentage}%`, pageWidth - margin - 20, yPos + 6, {
      align: 'right',
    });

    yPos += categoryBoxHeight;

    // Check if we need a new page
    if (yPos > pageHeight - 40) {
      addPageBreak();
      doc.setFillColor(...lightGray);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      yPos = margin;
    }
  });

  addFooter(3);

  // PAGE 4: ACTION PLAN
  addPageBreak();
  doc.setFillColor(...lightGray);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...amber);
  doc.text('YOUR 90-DAY AI ACTION PLAN', margin, 20);

  yPos = 45;

  const phases = [
    { name: 'Phase 1: Foundation', days: 'Days 1-30', color: red },
    { name: 'Phase 2: Integration', days: 'Days 31-60', color: purple },
    { name: 'Phase 3: Optimization', days: 'Days 61-90', color: green },
  ];

  insights.recommendations.slice(0, 3).forEach((rec, phaseIndex) => {
    if (yPos > pageHeight - 80) {
      addPageBreak();
      doc.setFillColor(...lightGray);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      yPos = margin;
    }

    const phase = phases[phaseIndex];

    // Phase header
    doc.setFillColor(...phase.color);
    doc.rect(margin, yPos, contentWidth, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...white);
    doc.text(`${phase.name} — ${phase.days}`, margin + 5, yPos + 7);

    yPos += 15;

    // Category
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...navy);
    doc.text(`${rec.category}`, margin, yPos);
    yPos += 6;

    // Action items
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    rec.actions.forEach((action, idx) => {
      const actionText = `${idx + 1}. ${action}`;
      const splitAction = doc.splitTextToSize(actionText, contentWidth - 10);
      doc.text(splitAction, margin + 5, yPos);
      yPos += splitAction.length * 4.5 + 2;
    });

    yPos += 8;
  });

  addFooter(4);

  // PAGE 5: NEXT STEPS
  addPageBreak();
  doc.setFillColor(...lightGray);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...amber);
  doc.text('NEXT STEPS', margin, 20);

  yPos = 50;

  // CTA Section
  doc.setFillColor(...navy);
  doc.rect(margin, yPos, contentWidth, 50, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...amber);
  doc.text('Ready to Transform Your AI Readiness?', margin + 10, yPos + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...white);
  doc.text(
    'Schedule a 30-minute strategy call with our team to discuss your',
    margin + 10,
    yPos + 22,
  );
  doc.text('personalized roadmap and implementation timeline.', margin + 10, yPos + 29);

  doc.setFillColor(...amber);
  doc.rect(margin + 10, yPos + 35, 80, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...navy);
  doc.text(
    'calendly.com/elios-ai',
    margin + 10,
    yPos + 39.5,
  );

  yPos += 70;

  // Contact Info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...navy);
  doc.text('Contact', margin, yPos);

  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...darkGray);
  doc.text('Elios AI Consulting', margin, yPos);
  yPos += 6;
  doc.text('33v Product Studio', margin, yPos);

  yPos += 20;

  // Footer text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  const footerTextArray = doc.splitTextToSize(
    'This report was generated by the AI Readiness Assessment tool, powered by Elios AI Consulting & 33v Product Studio. The insights and recommendations are based on your responses and industry best practices.',
    contentWidth,
  );
  doc.text(footerTextArray, margin, yPos);

  addFooter(5);

  // Save the PDF
  const fileName = `AI_Readiness_Report_${capturedData.company || 'Assessment'}.pdf`;
  doc.save(fileName);
}

function getNextMaturityLevel(current) {
  const levels = [
    'Reactive',
    'Aware',
    'Implementing',
    'Optimizing',
    'Autonomous',
  ];
  const index = levels.indexOf(current);
  return index < levels.length - 1 ? levels[index + 1] : 'Autonomous';
}

function getGradeMeaning(grade) {
  const meanings = {
    'AI-Native':
      'Your organization is operating at an elite level of AI maturity. You have the infrastructure, processes, team culture, and competitive positioning to leverage cutting-edge AI solutions immediately. Focus on advanced use cases and enterprise integrations.',
    Optimized:
      'You are ahead of 90% of businesses in AI readiness. Your foundation is strong, and you can begin implementing sophisticated AI solutions across your organization. The key is strategic prioritization and change management.',
    Advancing:
      'You have a strong foundation and are ready for multi-agent AI systems. Focus on bridging any gaps in team readiness and revenue operations. With targeted improvements in the next 90 days, you can unlock 3-5x efficiency gains.',
    Emerging:
      'You have key pieces in place and strong potential for rapid improvement. With a focused 90-day effort on your highest-impact gaps, you can achieve 3-5x efficiency gains and position yourself for advanced AI integration.',
    'Foundation Phase':
      'You are at the beginning of your AI transformation journey. Prioritize building your data infrastructure and establishing foundational processes. Once these are solid, you can layer in more sophisticated AI solutions.',
  };
  return meanings[grade] || 'Your organization has unique needs. Schedule a strategy call to discuss your specific AI readiness journey.';
}
