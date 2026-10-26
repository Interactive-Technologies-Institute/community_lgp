// Sent from the moderation page to contributors who accepted their invite
// but never gave consent, so they never get the weekly digest either. Shares
// the layout of send-contributor-access-email/content.ts; keep them in sync,
// and keep it email-safe (tables, inline styles).

export const SUBJECT = 'Falta só um passo para contribuir para o Dicionário de LGP';

export function buildConsentReminderEmail(siteUrl: string) {
	return TEMPLATE.replaceAll('{{SITE_URL}}', siteUrl);
}

const STEP_NUMBER_STYLE =
	'width:24px;height:24px;border:1px solid #c7d2fe;border-radius:12px;background-color:#ffffff;color:#2563eb;font-size:13px;font-weight:bold;';
const STEP_TEXT_STYLE = 'padding:4px 0 4px 12px;font-size:15px;line-height:1.5;color:#374151;';
const STEP_GAP =
	'<tr><td colspan="2" height="8" style="height:8px;line-height:8px;font-size:0;">&nbsp;</td></tr>';

function step(number: number, text: string) {
	return `<tr>
							<td width="24" height="24" align="center" valign="middle" style="${STEP_NUMBER_STYLE}">${number}</td>
							<td style="${STEP_TEXT_STYLE}">${text}</td>
						</tr>`;
}

const TEMPLATE = `<!DOCTYPE html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${SUBJECT}</title>
</head>
<body style="margin:0;padding:0;">
<div style="background-color:#f3f4f6;padding:40px 20px;">
	<div style="max-width:480px;margin:0 auto;background-color:#ffffff;border-radius:8px;padding:40px;font-family:Helvetica,Arial,sans-serif;">
		<h1 style="margin:0 0 20px;font-size:22px;line-height:1.3;color:#111827;">
			Falta só um passo para começar a gravar
		</h1>
		<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">Olá,</p>
		<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">
			Obrigado por ter aceitado o convite para contribuir com vídeos para a <strong>pesquisa por vídeo do Dicionário de LGP</strong>. Para começar a
			gravar, só falta ver o vídeo de consentimento e aceitá-lo.
		</p>
		<p style="margin:0 0 28px;">
			<a
				href="{{SITE_URL}}/islr-dataset"
				style="display:inline-block;background-color:#2563eb;color:#ffffff;font-size:16px;font-weight:bold;text-decoration:none;padding:14px 28px;border-radius:6px;"
				>Dar consentimento</a
			>
		</p>
		<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f6fb;border-radius:8px;margin:0 0 28px;">
			<tr>
				<td style="padding:20px 24px;">
					<p style="margin:0 0 12px;font-size:15px;font-weight:bold;color:#111827;">
						Como continuar
					</p>
					<table role="presentation" cellpadding="0" cellspacing="0" border="0">
						${step(1, 'Entre na sua conta')}
						${STEP_GAP}
						${step(2, 'Veja o vídeo de consentimento e aceite')}
						${STEP_GAP}
						${step(3, 'Comece a gravar gestos — cada um leva cerca de 10 segundos')}
					</table>
					<p style="margin:16px 0 0;font-size:14px;">
						<a href="{{SITE_URL}}/islr-dataset/tutorial" style="color:#2563eb;font-weight:bold;text-decoration:none;"
							>Dúvidas? Ver o guia detalhado →</a
						>
					</p>
				</td>
			</tr>
		</table>
		<div style="border-top:1px solid #e5e7eb;margin:0 0 20px;font-size:0;line-height:0;">&nbsp;</div>
		<p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:#6b7280;">
			Algum problema:
			<a href="mailto:joana.peixinho@tecnico.ulisboa.pt" style="color:#2563eb;">joana.peixinho@tecnico.ulisboa.pt</a>.<br />
			Recebeu este email porque aceitou o convite para contribuir para o dataset, mas ainda não deu consentimento.
		</p>
	</div>
</div>
</body>
</html>`;
