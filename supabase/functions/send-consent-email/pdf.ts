import { PDFDocument, PDFFont, rgb, StandardFonts } from 'npm:pdf-lib@1.17.1';

const PAGE_WIDTH = 595.28; // A4 portrait, in points
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BODY_SIZE = 10;
const LINE_HEIGHT = 14;

interface ConsentPdfInput {
	name: string;
	email: string;
	signedAt: string;
	choiceLabel: string;
	paragraphs: string[];
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
	const words = text.split(/\s+/);
	const lines: string[] = [];
	let currentLine = '';

	for (const word of words) {
		const candidate = currentLine ? `${currentLine} ${word}` : word;
		if (font.widthOfTextAtSize(candidate, size) > maxWidth && currentLine) {
			lines.push(currentLine);
			currentLine = word;
		} else {
			currentLine = candidate;
		}
	}
	if (currentLine) lines.push(currentLine);
	return lines;
}

export async function buildConsentPdf(input: ConsentPdfInput): Promise<Uint8Array> {
	const doc = await PDFDocument.create();
	const font = await doc.embedFont(StandardFonts.Helvetica);
	const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

	let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
	let y = PAGE_HEIGHT - MARGIN;

	function newPageIfNeeded(nextLineHeight: number) {
		if (y - nextLineHeight < MARGIN) {
			page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
			y = PAGE_HEIGHT - MARGIN;
		}
	}

	function drawParagraph(text: string, options: { font: PDFFont; size: number; gapAfter?: number }) {
		const lines = wrapText(text, options.font, options.size, CONTENT_WIDTH);
		for (const line of lines) {
			newPageIfNeeded(LINE_HEIGHT);
			page.drawText(line, {
				x: MARGIN,
				y,
				size: options.size,
				font: options.font,
				color: rgb(0, 0, 0),
			});
			y -= LINE_HEIGHT;
		}
		y -= options.gapAfter ?? 0;
	}

	drawParagraph('Consentimento: Dataset ISLR de Língua Gestual Portuguesa', {
		font: boldFont,
		size: 14,
		gapAfter: 16,
	});

	drawParagraph(`Nome: ${input.name}`, { font, size: BODY_SIZE });
	drawParagraph(`Email: ${input.email}`, { font, size: BODY_SIZE });
	drawParagraph(`Data e hora da assinatura: ${input.signedAt}`, { font, size: BODY_SIZE, gapAfter: 16 });

	for (const paragraph of input.paragraphs) {
		drawParagraph(paragraph, { font, size: BODY_SIZE, gapAfter: 8 });
	}

	y -= 8;
	drawParagraph(`[X] ${input.choiceLabel}`, { font: boldFont, size: BODY_SIZE, gapAfter: 0 });

	return doc.save();
}
