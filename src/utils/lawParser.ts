interface LawReference {
  lawName: string;
  lawId?: string;
  article: string;
  paragraph?: string;
  subparagraph?: string;
  item?: string;
}

interface LawApiParams {
  OC: string;
  target: string;
  type: 'XML' | 'JSON' | 'HTML';
  ID?: string;
  MST?: string;
  JO?: string;
  HANG?: string;
  HO?: string;
  MOK?: string;
}

const LAW_ID_MAP: { [key: string]: string } = {
  '법': '001823',
  '영': '001824',
  '규칙': '001825',
  '지방세법': '002969',
  '지방세법 시행령': '002970',
  '지방세법 시행규칙': '002971',
};

export function parseLawReference(provision: string): LawReference | null {
  const patterns = [
    /^(법|영|규칙)\s*제(\d+)조의?(\d*)(?:제(\d+)항)?(?:제(\d+)호)?(?:([가-하])목)?$/,
    /^(지방세법|지방세법\s*시행령|지방세법\s*시행규칙)\s*제(\d+)조의?(\d*)(?:제(\d+)항)?(?:제(\d+)호)?(?:([가-하])목)?$/,
  ];

  for (const pattern of patterns) {
    const match = provision.match(pattern);
    if (match) {
      const [, lawName, article, articleSub, paragraph, subparagraph, item] = match;
      
      return {
        lawName,
        lawId: LAW_ID_MAP[lawName.replace(/\s+/g, '')],
        article: article + (articleSub ? articleSub : ''),
        paragraph,
        subparagraph,
        item,
      };
    }
  }

  const simplePattern = /제(\d+)조의?(\d*)(?:①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩)?/;
  const simpleMatch = provision.match(simplePattern);
  if (simpleMatch) {
    const [, article, articleSub] = simpleMatch;
    return {
      lawName: '지방세법',
      lawId: LAW_ID_MAP['지방세법'],
      article: article + (articleSub ? articleSub : ''),
    };
  }

  return null;
}

export function formatArticleNumber(article: string): string {
  const match = article.match(/^(\d+)(\d*)$/);
  if (!match) return '000000';
  
  const mainArticle = match[1].padStart(4, '0');
  const subArticle = match[2] ? match[2].padStart(2, '0') : '00';
  
  return mainArticle + subArticle;
}

export function formatParagraphNumber(paragraph?: string): string {
  if (!paragraph) return '';
  return paragraph.padStart(4, '0') + '00';
}

export function formatSubparagraphNumber(subparagraph?: string): string {
  if (!subparagraph) return '';
  
  const match = subparagraph.match(/^(\d+)(\d*)$/);
  if (!match) return '000000';
  
  const main = match[1].padStart(4, '0');
  const sub = match[2] ? match[2].padStart(2, '0') : '00';
  
  return main + sub;
}

export function buildLawApiUrl(reference: LawReference): string {
  const baseUrl = 'http://www.law.go.kr/DRF/lawService.do';
  const params: LawApiParams = {
    OC: 'gangubuytax',
    target: 'lawjosub',
    type: 'JSON',
  };

  if (reference.lawId) {
    params.ID = reference.lawId;
  }

  if (reference.article) {
    params.JO = formatArticleNumber(reference.article);
  }

  if (reference.paragraph) {
    params.HANG = formatParagraphNumber(reference.paragraph);
  }

  if (reference.subparagraph) {
    params.HO = formatSubparagraphNumber(reference.subparagraph);
  }

  if (reference.item) {
    params.MOK = reference.item;
  }

  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return `${baseUrl}?${queryString}`;
}

export async function fetchLawProvision(provision: string): Promise<any> {
  const reference = parseLawReference(provision);
  if (!reference) {
    throw new Error('법령 참조를 파싱할 수 없습니다.');
  }

  const url = buildLawApiUrl(reference);
  
  try {
    const response = await fetch(`/api/law-proxy?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error('법령 정보를 가져올 수 없습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('법령 API 호출 실패:', error);
    throw error;
  }
}