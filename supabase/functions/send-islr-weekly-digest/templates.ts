// Email HTML for the weekly digest, as generated with Claude Design. content.ts
// fills the {{placeholders}} and drops the bloco_proximo_marco block when
// there's no next milestone. Keep it email-safe (tables, inline styles, no
// SVG) if you edit it.

// Contributor has recorded at least one video.
export const CONTINUE_TEMPLATE = `<!DOCTYPE html>
<html lang="pt-PT" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Continue a gravar gestos</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  body{margin:0;padding:0;width:100%!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
  table{border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0}
  img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}
  a{color:#27279B}
  @media only screen and (max-width:620px){
    .container{width:100%!important}
    .px{padding-left:24px!important;padding-right:24px!important}
    .stat{display:block!important;width:100%!important;box-sizing:border-box!important}
    .stat-gap{display:block!important;width:100%!important;height:12px!important}
    .h1{font-size:24px!important}
  }
  @media (prefers-color-scheme:dark){
    .bg-body{background-color:#0f1020!important}
    .bg-card{background-color:#1a1b33!important}
    .bg-soft{background-color:#23244a!important}
    .t-main{color:#f1f2f8!important}
    .t-soft{color:#c3c6dd!important}
    .t-brand{color:#9cc9ff!important}
    .link{color:#9cc9ff!important}
  }
  [data-ogsc] .bg-body{background-color:#0f1020!important}
  [data-ogsc] .bg-card{background-color:#1a1b33!important}
  [data-ogsc] .bg-soft{background-color:#23244a!important}
  [data-ogsc] .t-main{color:#f1f2f8!important}
  [data-ogsc] .t-soft{color:#c3c6dd!important}
  [data-ogsc] .t-brand{color:#9cc9ff!important}
</style>
</head>
<body class="bg-body" style="margin:0;padding:0;background-color:#EBF5FF;">
<!-- Preheader (texto de pré-visualização) -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#EBF5FF;opacity:0;">
  Veja o resumo da sua contribuição e quanto falta para o próximo marco.&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-body" bgcolor="#EBF5FF" style="background-color:#EBF5FF;">
<tr><td align="center" style="padding:32px 12px;">

  <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="container" style="width:600px;max-width:600px;">

    <!-- Cabeçalho -->
    <tr><td bgcolor="#27279B" style="background-color:#27279B;padding:20px 40px;border-radius:12px 12px 0 0;" class="px">
      <span style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#ffffff;">Dicionário LGP</span>
      <span style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#ECD855;">&nbsp;·&nbsp;Dataset</span>
    </td></tr>

    <!-- Corpo -->
    <tr><td class="bg-card px" bgcolor="#ffffff" style="background-color:#ffffff;padding:36px 40px 32px;">

      <p class="t-main" style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#333333;">Olá {{nome}},</p>
      <h1 class="h1 t-brand" style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:26px;line-height:1.25;font-weight:bold;color:#27279B;">Obrigado pelo seu contributo</h1>
      <p class="t-main" style="margin:0 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#333333;">Cada vídeo que grava ajuda a construir a ferramenta de pesquisa por vídeo. Este é o seu resumo:</p>

      <!-- Resumo -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td class="stat bg-soft" width="48%" valign="top" bgcolor="#EBF5FF" style="width:48%;background-color:#EBF5FF;border-radius:10px;padding:18px 20px;">
            <p class="t-soft" style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.4;color:#555555;">Na semana passada</p>
            <p class="t-brand" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:30px;line-height:1.1;font-weight:bold;color:#27279B;">{{videos_semana}}</p>
            <p class="t-soft" style="margin:2px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#555555;">{{videos_semana_rotulo}}</p>
          </td>
          <td class="stat-gap" width="4%" style="width:4%;font-size:0;line-height:0;">&nbsp;</td>
          <td class="stat bg-soft" width="48%" valign="top" bgcolor="#EBF5FF" style="width:48%;background-color:#EBF5FF;border-radius:10px;padding:18px 20px;">
            <p class="t-soft" style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.4;color:#555555;">No total</p>
            <p class="t-brand" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:30px;line-height:1.1;font-weight:bold;color:#27279B;">{{total_videos}}</p>
            <p class="t-soft" style="margin:2px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#555555;">{{total_videos_rotulo}}</p>
          </td>
        </tr>
      </table>

      <!-- INÍCIO bloco_proximo_marco: omitir este bloco se não houver próximo marco -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
        <tr><td bgcolor="#FBF6D6" class="bg-soft" style="background-color:#FBF6D6;border:1px solid #ECD855;border-radius:10px;padding:16px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="56" valign="middle" style="width:56px;padding-right:16px;">
                <img src="{{proximo_marco_imagem}}" width="56" height="56" alt="Crachá {{proximo_marco_nome}}" style="display:block;width:56px;height:56px;">
              </td>
              <td valign="middle">
                <p class="t-soft" style="margin:0 0 2px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#555555;">Próximo marco</p>
                <p class="t-brand" style="margin:0 0 2px;font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:1.3;font-weight:bold;color:#27279B;">{{proximo_marco_nome}}</p>
                <p class="t-main" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;">Vídeos em falta: <strong>{{proximo_marco_faltam}}</strong></p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
      <!-- FIM bloco_proximo_marco -->

      <!-- Botão -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
        <tr><td align="center" bgcolor="#27279B" style="background-color:#27279B;border-radius:8px;">
          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="{{link_gravar}}" style="height:52px;v-text-anchor:middle;width:240px;" arcsize="15%" stroke="f" fillcolor="#27279B"><w:anchorlock/><center style="color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;">Continuar a gravar</center></v:roundrect><![endif]-->
          <!--[if !mso]><!-- --><a href="{{link_gravar}}" target="_blank" style="display:inline-block;padding:16px 32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:20px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:8px;background-color:#27279B;">Continuar a gravar</a><!--<![endif]-->
        </td></tr>
      </table>

    </td></tr>

    <!-- Rodapé -->
    <tr><td class="bg-card px" bgcolor="#ffffff" style="background-color:#ffffff;padding:0 40px 28px;border-radius:0 0 12px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="border-top:1px solid #DCE6F2;padding-top:18px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#666666;" class="t-soft">
          <a href="{{link_progresso}}" class="link" style="color:#27279B;text-decoration:underline;">Ver o meu progresso</a>
          &nbsp;·&nbsp;
          <a href="{{link_cancelar}}" class="link" style="color:#666666;text-decoration:underline;">Deixar de receber estes emails</a>
        </td></tr>
      </table>
    </td></tr>

  </table>
  <!--[if mso]></td></tr></table><![endif]-->

</td></tr>
</table>
</body>
</html>
`;

// Contributor hasn't recorded anything yet.
export const FIRST_SIGN_TEMPLATE = `<!DOCTYPE html>
<html lang="pt-PT" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Grave o seu primeiro gesto</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  body{margin:0;padding:0;width:100%!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
  table{border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0}
  img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}
  a{color:#27279B}
  @media only screen and (max-width:620px){
    .container{width:100%!important}
    .px{padding-left:24px!important;padding-right:24px!important}
    .h1{font-size:24px!important}
  }
  @media (prefers-color-scheme:dark){
    .bg-body{background-color:#0f1020!important}
    .bg-card{background-color:#1a1b33!important}
    .bg-soft{background-color:#23244a!important}
    .t-main{color:#f1f2f8!important}
    .t-soft{color:#c3c6dd!important}
    .t-brand{color:#9cc9ff!important}
    .link{color:#9cc9ff!important}
  }
  [data-ogsc] .bg-body{background-color:#0f1020!important}
  [data-ogsc] .bg-card{background-color:#1a1b33!important}
  [data-ogsc] .bg-soft{background-color:#23244a!important}
  [data-ogsc] .t-main{color:#f1f2f8!important}
  [data-ogsc] .t-soft{color:#c3c6dd!important}
  [data-ogsc] .t-brand{color:#9cc9ff!important}
</style>
</head>
<body class="bg-body" style="margin:0;padding:0;background-color:#EBF5FF;">
<!-- Preheader (texto de pré-visualização) -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#EBF5FF;opacity:0;">
  Cada gravação dura poucos segundos e ajuda a construir a ferramenta de pesquisa por vídeo.&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-body" bgcolor="#EBF5FF" style="background-color:#EBF5FF;">
<tr><td align="center" style="padding:32px 12px;">

  <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="container" style="width:600px;max-width:600px;">

    <!-- Cabeçalho -->
    <tr><td bgcolor="#27279B" style="background-color:#27279B;padding:20px 40px;border-radius:12px 12px 0 0;" class="px">
      <span style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#ffffff;">Dicionário LGP</span>
      <span style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#ECD855;">&nbsp;·&nbsp;Dataset</span>
    </td></tr>

    <!-- Corpo -->
    <tr><td class="bg-card px" bgcolor="#ffffff" style="background-color:#ffffff;padding:36px 40px 32px;">

      <p class="t-main" style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#333333;">Olá {{nome}},</p>
      <h1 class="h1 t-brand" style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:26px;line-height:1.25;font-weight:bold;color:#27279B;">O seu primeiro gesto faz a diferença</h1>
      <p class="t-main" style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#333333;">Ajude a construir a ferramenta de pesquisa por vídeo. Quanto mais pessoas diferentes gravarem, melhor ela funciona para toda a comunidade surda.</p>
      <p class="t-main" style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#333333;">Começar é rápido: cada gravação dura poucos segundos e basta a câmara do computador ou do telemóvel.</p>

      <!-- Primeiro marco -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td bgcolor="#FBF6D6" class="bg-soft" style="background-color:#FBF6D6;border:1px solid #ECD855;border-radius:10px;padding:16px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="56" valign="middle" style="width:56px;padding-right:16px;">
                <img src="{{proximo_marco_imagem}}" width="56" height="56" alt="Crachá Primeiros Gestos" style="display:block;width:56px;height:56px;">
              </td>
              <td valign="middle">
                <p class="t-main" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#333333;">Grave <strong>5 gestos</strong> e desbloqueie o primeiro marco, <strong class="t-brand" style="color:#27279B;">Primeiros Gestos</strong>.</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>

      <!-- Botão -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
        <tr><td align="center" bgcolor="#27279B" style="background-color:#27279B;border-radius:8px;">
          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="{{link_gravar}}" style="height:52px;v-text-anchor:middle;width:280px;" arcsize="15%" stroke="f" fillcolor="#27279B"><w:anchorlock/><center style="color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;">Gravar o primeiro gesto</center></v:roundrect><![endif]-->
          <!--[if !mso]><!-- --><a href="{{link_gravar}}" target="_blank" style="display:inline-block;padding:16px 32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:20px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:8px;background-color:#27279B;">Gravar o primeiro gesto</a><!--<![endif]-->
        </td></tr>
      </table>

      <p class="t-soft" style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#555555;">Primeira vez? <a href="{{link_tutorial}}" class="link" style="color:#27279B;text-decoration:underline;">Veja como funciona</a>.</p>

    </td></tr>

    <!-- Rodapé -->
    <tr><td class="bg-card px" bgcolor="#ffffff" style="background-color:#ffffff;padding:0 40px 28px;border-radius:0 0 12px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="border-top:1px solid #DCE6F2;padding-top:18px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#666666;" class="t-soft">
          <a href="{{link_progresso}}" class="link" style="color:#27279B;text-decoration:underline;">Ver o meu progresso</a>
          &nbsp;·&nbsp;
          <a href="{{link_cancelar}}" class="link" style="color:#666666;text-decoration:underline;">Deixar de receber estes emails</a>
        </td></tr>
      </table>
    </td></tr>

  </table>
  <!--[if mso]></td></tr></table><![endif]-->

</td></tr>
</table>
</body>
</html>
`;
