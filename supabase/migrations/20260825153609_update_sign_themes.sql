-- Update theme_flattened column
create or replace function public.update_theme_flattened()
returns trigger
language plpgsql
as $function$
begin
  new.theme_flattened := (
    select string_agg(coalesce(t.name, selected.id), ', ' order by selected.position)
    from unnest(new.theme) with ordinality as selected(id, position)
    left join public.themes t on t.id::text = selected.id
  );
  return new;
end;
$function$;

drop trigger if exists set_theme_flattened_from_theme_ids on public.signs;

create trigger set_theme_flattened_from_theme_ids
before insert or update of theme on public.signs
for each row
execute function public.update_theme_flattened();

-- Update dictionary column
create or replace function public.update_dictionary_from_theme()
returns trigger
language plpgsql
as $function$
begin
  new.dictionary := (
    select array_agg(selected_dictionary.dictionary order by selected_dictionary.first_position)
    from (
      select t.dictionary, min(selected.position) as first_position
      from unnest(new.theme) with ordinality as selected(id, position)
      join public.themes t on t.id::text = selected.id
      where t.dictionary is not null
      group by t.dictionary
    ) as selected_dictionary
  );
  return new;
end;
$function$;

drop trigger if exists set_dictionary_from_theme_ids on public.signs;

create trigger set_dictionary_from_theme_ids
before insert or update of theme on public.signs
for each row
execute function public.update_dictionary_from_theme();

-- Replace each empty array below with one or more IDs from public.themes,
with theme_mapping (old_theme, new_theme_ids) as (
  values
    (array['(1ªCEB) PARTES DA CASA']::text[], array['122']::text[]),
    (array['(1´CEB) GEOMETRIA/ MATEMÁTICA']::text[], array['95']::text[]),
    (array['(1ºCEB) ALIMENTOS E NUTRIÇÃO/ PORTUGUÊS/ ESTUDO DO MEIO']::text[], array['107']::text[]),
    (array['(1ºCEB) AMBIENTE NATURAL/ ALIMENTOS E NUTRIÇÃO/ ESTUDO DO MEIO']::text[], array['108','107']::text[]),
    (array['(1ºCEB) AMBIENTE NATURAL/ ESTUDO DO MEIO']::text[], array['108']::text[]),
    (array['(1ºCEB) ANIMAIS/ PORTUGUÊS']::text[], array['109']::text[]),
    (array['(1ºCEB) ARTES VISUAIS/ EDUCAÇÃO ARTÍSTICA']::text[], array['128']::text[]),
    (array['(1ºCEB) CASA DE BANHO']::text[], array['122']::text[]),
    (array['(1ºCEB) CASA E DIVISÕES']::text[], array['123']::text[]),
    (array['(1ºCEB) CELEBRAR']::text[], array['105']::text[]),
    (array['(1ºCEB) CIDADANIA E RESPONSABILIDADE/ ESTUDO DO MEIO']::text[], array['110']::text[]),
    (array['(1ºCEB) COPRO HUMANO E SAÚDE/ PORTUGUÊS/ ESTUDO DO MEIO']::text[], array['112']::text[]),
    (array['(1ºCEB) CORES/ PORTUGUÊS']::text[], array['111']::text[]),
    (array['(1ºCEB) CORPO HUMANO E SAÚDE/ ESTUDO DO MEIO']::text[], array['112']::text[]),
    (array['(1ºCEB) CORPO HUMANO E SAÚDE/ PORTUGUÊS/ ESTUDO DO MEIO']::text[], array['112']::text[]),
    (array['(1ºCEB) DIAS DA SEMANA/ PORTUGUÊS']::text[], array['113']::text[]),
    (array['1ºCEB-EDUCAÇÃO ARTÍSTICA']::text[], array['127']::text[]),
    (array['(1ºCEB) ELEMENTOS BÁSICOS DA ARTE/ EDUCAÇÃO ARTÍSTICA']::text[], array['131']::text[]),
    (array['(1ºCEB) ESTAÇÕES DO ANO/ PORTUGUÊS']::text[], array['115']::text[]),
    (array['(1ºCEB) ESTATÍSTICA E PROBABILIDADES/ MATEMÁTICA']::text[], array['93']::text[]),
    (array['(1ºCEB) ESTATÍSTICAS E PROBABILIDADES/ MATEMÁTICA']::text[], array['93']::text[]),
    (array['1º CEB - ESTUDO DO MEIO']::text[], array['106']::text[]),
    (array['1º CEB-ESTUDO DO MEIO']::text[], array['106']::text[]),
    (array['1ºCEB-ESTUDO DO MEIO']::text[], array['106']::text[]),
    (array['(1ºCEB) ESTUDO DO MEIO/ CORPO HUMANO']::text[], array['112']::text[]),
    (array['(1ºCEB) FAMÍLIA E SOCIEDADE/ PORTUGUÊS/ ESTUDO DO MEIO']::text[], array['116']::text[]),
    (array['(1ºCEB) FRAÇÕES E DÉCIMAIS/ MATEMÁTICA']::text[], array['94']::text[]),
    (array['(1ºCEB) GEOGRAFIA LOCAL E GLOBAL/ ESTUDO DO MEIO']::text[], array['117']::text[]),
    (array['(1ºCEB) GEOMETRIA/ MATEMÁTICA']::text[], array['95']::text[]),
    (array['(1ºCEB) INSTRUMENTOS DE MEDIÇÃO/ ESTUDO DO MEIO']::text[], array['126']::text[]),
    (array['(1ºCEB) LGP']::text[], array['105']::text[]),
    (array['(1ºCEB) MAEMÁTICA GERAL']::text[], array['92']::text[]),
    (array['(1ºCEB) MATEMÁTICA']::text[], array['92']::text[]),
    (array['(1ºCEB) MATEMÁTICA/ ARTES VISUAIS']::text[], array['100']::text[]),
    (array['(1ºCEB) MATEMÁTICA GERAL']::text[], array['92']::text[]),
    (array['(1ºCEB) MATÉRIA E ENERGIA/ ESTUDO DO MEIO']::text[], array['118']::text[]),
    (array['(1ºCEB) MEDIDAS( MATEMÁTICA']::text[], array['96']::text[]),
    (array['(1ºCEB) MEDIDAS/ MATEMÁTICA']::text[], array['96']::text[]),
    (array['(1ºCEB) MEIOS DE TRANSPORTE E COMUNICAÇÕES/ ESTUDO DO MEIO']::text[], array['119']::text[]),
    (array['(1ºCEB) MESES DO ANO/ PORTUGUÊS']::text[], array['120']::text[]),
    (array['(1ºCEB) MÚSICA/ EDUCAÇÃO ARTÍSTICA']::text[], array['129']::text[]),
    (array['(1ºCEB) NÚMEROS E OPERAÇÕES/ MATEMÁTICA']::text[], array['98']::text[]),
    (array['(1ºCEB) NÚMEROS/ PORTUGUÊS/ MATEMÁTICA']::text[], array['97']::text[]),
    (array['(1ºCEB) OBJETOS DA ESCOLA']::text[], array['121']::text[]),
    (array['(1ºCEB) OBJETOS DA ESCOLA/ ARTES VISUAIS']::text[], array['121']::text[]),
    (array['(1ºCEB) OUTROS CONCEITOS BÁSICOS/ MATEMÁTICA']::text[], array['92']::text[]),
    (array['(1ºCEB) PARTES DA CASA']::text[], array['122']::text[]),
    (array['(1ºCEB) PORTUGUÊS']::text[], array['101']::text[]),
    (array['(1ºCEB) PORTUGUÊS/ ADJETIVOS']::text[], array['102']::text[]),
    (array['(1ºCEB) PORTUGUÊS/ EMOÇÕES']::text[], array['114']::text[]),
    (array['(1ºCEB) PORTUGUÊS/ FAMÍLIA']::text[], array['116']::text[]),
    (array['(1ºCEB) PORTUGUÊS GERAL']::text[], array['101']::text[]),
    (array['(1ºCEB) PORTUGUÊS/ VESTUÁRIO']::text[], array['125']::text[]),
    (array['(1ºCEB) PROFISSÕES/ PORTUGUÊS/ ESTUDO DO MEIO']::text[], array['124']::text[]),
    (array['(1ºCEB) RELAÇÕES E COMPARAÇÕES/ MATEMÁTICA']::text[], array['99']::text[]),
    (array['(1ºCEB) SAUDAÇÕES/ PORTUGUÊS']::text[], array['104']::text[]),
    (array['(1ºCEB) SIMETRIA E PADRÕES/ MATEMÁTICA']::text[], array['100']::text[]),
    (array['(1ºCEB) TEATRO/ EDUCAÇÃO ARTÍSTICA']::text[], array['130']::text[]),
    (array['(1ºCEB) VERBOS']::text[], array['105']::text[]),
    (array['AC (ADJETIVOS)']::text[], array['44']::text[]),
    (array['AC (ADVÉRBIOS)']::text[], array['48']::text[]),
    (array['AC (ALIMENTAÇÃO)']::text[], array['1']::text[]),
    (array['AC (ANIMAIS)']::text[], array['7']::text[]),
    (array['ação']::text[], array['137']::text[]),
    (array['AC (CORES)']::text[], array['17']::text[]),
    (array['AC (CORPO HUMANO)']::text[], array['18']::text[]),
    (array['AC (DIAS DA SEMANA)']::text[], array['85']::text[]),
    (array['AC (EDIFÍCIOS E SERVIÇOS)']::text[], array['22']::text[]),
    (array['AC (ESCOLA)']::text[], array['23']::text[]),
    (array['AC (FAMÍLIA)']::text[], array['75']::text[]),
    (array['AC (GEOGRAFIA)']::text[], array['27']::text[]),
    (array['AC (HABITAÇÃO)']::text[], array['64']::text[]),
    (array['AC (ILHAS)']::text[], array['36']::text[]),
    (array['AC (LOCALIDADES)']::text[], array['37']::text[]),
    (array['AC (NÚMEROS)']::text[], array['46']::text[]),
    (array['AC (OBJETOS)']::text[], array['61']::text[]),
    (array['AC (PROFISSÕES)']::text[], array['76']::text[]),
    (array['AC (PRONOMES)']::text[], array['51']::text[]),
    (array['AC (RELIGIÃO E TRADIÇÕES AÇOREANAS)']::text[], array['79']::text[]),
    (array['AC (SAÚDE)']::text[], array['72']::text[]),
    (array['AC (SUBSTÂNCIAS)']::text[], array['56']::text[]),
    (array['AC (TRANSPORTES)']::text[], array['90']::text[]),
    (array['AC (VALORES ÉTICOS)']::text[], array['80']::text[]),
    (array['AC (VERBOS)']::text[], array['47']::text[]),
    (array['AC (VESTUÁRIO)']::text[], array['91']::text[]),
    (array['CBR (CORES)']::text[], array['17']::text[]),
    (array['CIÊNCIAS DA LINGUAGEM']::text[], array['132']::text[]),
    (array['CIÊNCIAS DA LINGUAGEM - Filmar']::text[], array['132']::text[]),
    (array['CIÊNCIAS DA LINGUAGEM - Filmar HC']::text[], array['132']::text[]),
    (array['DACTILOLOGIA']::text[], array['45','103']::text[]),
    (array['EDUCAÇÃO PARA SURDOS']::text[], array['26']::text[]),
    (array['EDUCAÇÃO PARA SURDOS - Filmar']::text[], array['26']::text[]),
    (array['EDUCAÇÃO PARA SURDOS - Filmar/HC']::text[], array['26']::text[]),
    (array['(FAMÍLIA E SOCIEDADE/ PORTUGUÊS/ ESTUDO DO MEIO']::text[], array['75']::text[]),
    (array['MAD (ADJETIVOS)']::text[], array['44']::text[]),
    (array['MAD (ADVÉRBIOS)']::text[], array['48']::text[]),
    (array['MAD (ALIMENTAÇÃO)']::text[], array['1']::text[]),
    (array['MAD (ANIMAIS)']::text[], array['7']::text[]),
    (array['MAD (CASA/ EDIFÍCIOS/ ESTABELECIMENTOS)']::text[], array['22']::text[]),
    (array['MAD (CASA/ EDIFÍCIOS/ ESTABELECIMENTOS)\']::text[], array['22']::text[]),
    (array['MAD (CELEBRAÇÕES/ RELIGIÃO)']::text[], array['77']::text[]),
    (array['MAD (CLUBES E MARCAS)']::text[], array['20']::text[]),
    (array['MAD (CONTINENTES)']::text[], array['28']::text[]),
    (array['MAD (CORES)']::text[], array['17']::text[]),
    (array['MAD (DESPORTO)']::text[], array['21']::text[]),
    (array['MAD (DIAS DA SEMANA)']::text[], array['85']::text[]),
    (array['MAD (ESTAÇÕES DO ANO)']::text[], array['86']::text[]),
    (array['MAD (EXPRESSÕES)']::text[], array['14']::text[]),
    (array['MAD (FAMÍLIA)']::text[], array['75']::text[]),
    (array['MAD (GÉNERO)']::text[], array['78']::text[]),
    (array['MAD (LOCALIDADES)']::text[], array['32']::text[]),
    (array['MAD (NATUREZA)']::text[], array['56']::text[]),
    (array['MAD (NOMES/ SUBSTANTIVOS)']::text[], array['49']::text[]),
    (array['MAD (NUMERAÇÃO)']::text[], array['50']::text[]),
    (array['MAD (OBJETOS)']::text[], array['61']::text[]),
    (array['MAD (PAÍSES)']::text[], array['33']::text[]),
    (array['MAD (PARTES DO DIA)']::text[], array['88']::text[]),
    (array['MAD (PROFISSÕES)']::text[], array['76']::text[]),
    (array['MAD (REGIÕES AUTÓNOMAS DE PORTUGAL)']::text[], array['34']::text[]),
    (array['MAD (REGIÕES E CIDADES DA MADEIRA)']::text[], array['35']::text[]),
    (array['MAD (TEMPO)']::text[], array['89']::text[]),
    (array['MAD (TRANSPORTES)']::text[], array['90']::text[]),
    (array['MAD (VERBOS)']::text[], array['47']::text[]),
    (array['MAD (VESTUÁRIO)']::text[], array['91']::text[]),
    (array['NOME GESTUAL']::text[], array['58']::text[]),
    (array['Proposta - Em Discussão']::text[], array['134']::text[]),
    (array['PRT (ADJETIVOS)']::text[], array['44']::text[]),
    (array['PRT (ADVÉRBIOS)']::text[], array['48']::text[]),
    (array['PRT (ALIMENTAÇÃO)']::text[], array['1']::text[]),
    (array['PRT (ANIMAIS)']::text[], array['7']::text[]),
    (array['PRT (CIDADE DO PORTO)']::text[], array['38']::text[]),
    (array['PRT (CORES)']::text[], array['17']::text[]),
    (array['PRT (CORPO HUMANO)']::text[], array['18']::text[]),
    (array['PRT (DESPORTO)']::text[], array['21']::text[]),
    (array['PRT (DIAS DA SEMANA)']::text[], array['85']::text[]),
    (array['PRT (DISCIPLINAS)']::text[], array['25']::text[]),
    (array['PRT (DISTRITO DO PORTO)']::text[], array['39']::text[]),
    (array['PRT (EDUCAÇÃO)']::text[], array['24']::text[]),
    (array['PRT (EXPRESSÕES IDIOMÁTICAS)']::text[], array['14']::text[]),
    (array['PRT (FAMÍLIA)']::text[], array['75']::text[]),
    (array['PRT (FESTIVIDADES)']::text[], array['81']::text[]),
    (array['PRT (FRUTAS)']::text[], array['3']::text[]),
    (array['PRT (LOCALIDADES)']::text[], array['40']::text[]),
    (array['PRT (MARCAS)']::text[], array['54']::text[]),
    (array['PRT (MATEMÁTICA)']::text[], array['55']::text[]),
    (array['PRT (MESES)']::text[], array['87']::text[]),
    (array['PRT (NOMES/ SUBSTANTIVOS)']::text[], array['49']::text[]),
    (array['PRT (NÚMEROS) ARCAÍSMO']::text[], array['52']::text[]),
    (array['PRT (ORIENTAÇÃO SEXUAL)']::text[], array['82']::text[]),
    (array['PRT (PAÍSES)']::text[], array['33']::text[]),
    (array['PRT (PEIXES)']::text[], array['4']::text[]),
    (array['PRT (PRATOS/ BEBIDAS)']::text[], array['6']::text[]),
    (array['PRT (PROFISSÕES)']::text[], array['76']::text[]),
    (array['PRT (SAÚDE)']::text[], array['72']::text[]),
    (array['PRT (SUBSTÃNCIAS)']::text[], array['56']::text[]),
    (array['PRT (TRABALHO)']::text[], array['83']::text[]),
    (array['PRT (VERBOS)']::text[], array['47']::text[]),
    (array['tema por definir']::text[], array['138']::text[]),
    (array['TERMINOLOGIA EM MEDICINA']::text[], array['133']::text[]),
    (array['VG (ANIMAIS)']::text[], array['7']::text[]),
    (array['VG (CAPITAIS DE PAÍSES)']::text[], array['41']::text[]),
    (array['VG (CARNES)']::text[], array['2']::text[]),
    (array['VG (CASA DE BANHO)']::text[], array['66']::text[]),
    (array['VG (CIDADANIA)']::text[], array['74']::text[]),
    (array['VG (CIDADES DO MUNDO)']::text[], array['42']::text[]),
    (array['VG (CLUBES DE FUTEBOL)']::text[], array['19']::text[]),
    (array['VG (CONTINENTES)']::text[], array['28']::text[]),
    (array['VG (CORES)']::text[], array['17']::text[]),
    (array['VG (CORPO HUMANO)']::text[], array['18']::text[]),
    (array['VG (COZINHA)']::text[], array['67']::text[]),
    (array['VG (CUMPRIMENTOS)']::text[], array['12']::text[]),
    (array['VG (DESPENSA)']::text[], array['68']::text[]),
    (array['VG (DESPORTO)']::text[], array['21']::text[]),
    (array['VG (DIAS DA SEMANA)']::text[], array['85']::text[]),
    (array['VG (EDUCAÇÃO PARA SURDOS)']::text[], array['26']::text[]),
    (array['VG (ESTAÇÕES DO ANO)']::text[], array['86']::text[]),
    (array['VG (EXPRESSÕES)']::text[], array['14']::text[]),
    (array['VG (FAMÍLIA)']::text[], array['75']::text[]),
    (array['VG (FRUTAS)']::text[], array['3']::text[]),
    (array['VG (INTRODUÇÃO PESSOAL)']::text[], array['15']::text[]),
    (array['VG (LISBOA E VALE DO TEJO)']::text[], array['30']::text[]),
    (array['VG (LOCALIDADES DA CIDADE DE LISBOA)']::text[], array['31']::text[]),
    (array['VG (MATERIAL DE ESCRITÓRIO)']::text[], array['62']::text[]),
    (array['VG (MESES)']::text[], array['87']::text[]),
    (array['VG (NATUREZA)']::text[], array['56']::text[]),
    (array['VG (NOMES GESTUAIS - COMUNIDADE SURDA)']::text[], array['58']::text[]),
    (array['VG (NOMES GESTUAIS - PERSONALIDADES)']::text[], array['59']::text[]),
    (array['VG (NOTÁRIO)']::text[], array['60']::text[]),
    (array['VG (NUM CARD)']::text[], array['46']::text[]),
    (array['VG (PAÍSES)']::text[], array['33']::text[]),
    (array['VG (PARTES DA CASA)']::text[], array['64']::text[]),
    (array['VG (PEIXES)']::text[], array['4']::text[]),
    (array['VG (PROFISSÕES)']::text[], array['76']::text[]),
    (array['VG (QUARTO/ MOBILIÁRIO)']::text[], array['69']::text[]),
    (array['VG (REDES SOCIAIS)']::text[], array['71']::text[]),
    (array['VG (SALA DE ESTAR)']::text[], array['70']::text[]),
    (array['VG (SENTIMENTOS E EMOÇÕES)']::text[], array['53']::text[]),
    (array['VG (SOCIEDADE)']::text[], array['73']::text[]),
    (array['VG (TRANSPORTES)']::text[], array['90']::text[]),
    (array['VG (VEGETAIS)']::text[], array['5']::text[]),
    (array['VG (VERBOS)']::text[], array['47']::text[]),
    (array['VG (VESTUÁRIO)']::text[], array['91']::text[]),
    (array['(1ºCEB) MEIOS DE TRANSPORTE E COMUNICAÇÕES/ ESTUDO DO MEIO', 'VG (TRANSPORTES)']::text[], array['119','90']::text[]),
    (array['VG (NOMES GESTUAIS - COMUNIDADE SURDA)', 'VG (EDUCAÇÃO PARA SURDOS)']::text[], array['58','26']::text[])
)
update public.signs as sign
set theme = theme_mapping.new_theme_ids
from theme_mapping
where sign.theme = theme_mapping.old_theme
  and cardinality(theme_mapping.new_theme_ids) > 0;
