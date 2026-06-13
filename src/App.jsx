import { useEffect, useMemo, useState } from "react";
import { gameInfo } from "./data/gameData";
import { dummyLeaderboard } from "./data/leaderboardData";
import { formatTime, getClearTitle, getHintEnding } from "./utils/timeUtils";
import heroImg from "./assets/hero.png";
import "./styles.css";

const SAVE_KEY = "royalLetterEscapeSave";
const OLD_SAVE_KEY = "marigoldEscapeSave";

const gameConfig = {
  title: gameInfo?.title || "왕비 후보의 서찰",
  subtitle: gameInfo?.subtitle || "궁중 공방 미스터리 야외 방탈출",
  validCodes: gameInfo?.validCodes || ["TEST", "ROYAL", "ROYAL-001"],
  playTime: gameInfo?.playTime || "60~90분",
  players: gameInfo?.players || "1~4명",
  requiredItems: gameInfo?.requiredItems || ["스마트폰", "사건 키트", "필기구"],
  kitItems: gameInfo?.kitItems || [
    "왕비 후보의 서찰",
    "증거 사진",
    "조사 지도",
    "기록지",
  ],
};

const storyFlow = [
  {
    id: "teaser",
    type: "teaser",
    title: "왕비 후보의 서찰",
    subtitle: "궁중 공방 미스터리 야외 방탈출",
    videoSrc: "/teaser.mp4",
    posterSrc: "/teaser-poster.png",
    description:
      "혼례를 앞둔 궁궐. 왕비 후보의 물건들이 하나둘 사라지고, 이름 없는 서찰 하나가 당신에게 도착한다.",
    buttonText: "사건 키트 개봉하기",
  },
  {
    id: "prologue",
    type: "story",
    chapter: "프롤로그",
    title: "이름 없는 소녀의 서찰",
    paragraphs: [
      "혼례를 사흘 앞둔 날이었다.",
      "왕실은 유례없이 분주했다. 궁 안팎에서는 혼례 준비가 한창이었고, 기록관인 당신 역시 쏟아지는 문서와 보고서에 파묻혀 정신없는 나날을 보내고 있었다.",
      "왕 이현과 유력한 왕비 후보 연이의 혼례는 이미 기정사실로 여겨지고 있었기에, 모두가 다가올 경사를 기대하고 있었다.",
      "그날도 평소와 다름없이 혼례 관련 기록을 정리하던 당신은 책상 위에 놓인 낯선 봉투 하나를 발견했다.",
      "분명 조금 전까지 없었던 것이었다.",
      "봉투에는 발신인의 이름도, 관인도 찍혀 있지 않았다. 다만 정갈한 필체로 짧게 적힌 문구만이 눈에 들어왔다.",
      "「부디 이 글을 읽어주시옵소서.」",
      "이상한 기분에 사로잡힌 당신은 조심스럽게 봉인을 뜯었다.",
      "안에는 서찰 한 장이 들어 있었다.",
      "서찰에는 자신이 억울한 누명을 쓰고 있으며, 혼례를 앞두고 전하와의 추억이 담긴 물건들이 하나둘 사라지거나 훼손되고 있다는 내용이 적혀 있었다.",
      "잠시 서찰을 내려다보던 당신은 함께 동봉된 물건들을 확인했다.",
      "낡은 증거 사진 여러 장. 그리고 훼손된 물건들의 기록.",
      "깨져버린 도자기. 끊어진 매듭. 사라진 팔찌. 찢겨진 연서. 버려진 초상화.",
      "언뜻 보기에는 서로 아무 관련도 없어 보이는 물건들이었다.",
      "그러나 이상하게도 모든 물건에는 누군가의 소중한 추억이 깃들어 있는 듯했다.",
      "혼례를 앞둔 왕실. 정체를 숨긴 한 소녀의 도움 요청. 그리고 의미를 알 수 없는 증거들.",
      "당신은 직감했다.",
      "이것은 단순한 장난도, 우연한 파손 사건도 아니다.",
      "어딘가에 숨겨진 진실이 있다.",
      "그리고 그 진실은 지금, 당신의 손에 맡겨졌다.",
    ],
    acquiredItems: [
      "왕비 후보의 서찰",
      "낡은 증거 사진",
      "훼손된 물건들의 기록",
      "조사 지도",
    ],
    buttonText: "첫 번째 단서로 이동",
  },
  {
    id: "mission-1",
    type: "mission",
    missionId: 1,
    chapter: "미션 1",
    title: "깨진 도자기",
    location: "향기도예 / 갤러리풍경",
    piece: "깨진 도자기 조각",
    intro:
      "첫 번째 단서는 깨진 도자기 조각이다. 이 도자기는 전하와 왕비 후보 A가 어린 시절 함께 만들었던 추억의 물건으로, 둘 사이의 약속을 상징하는 물건이었다.",
    instruction:
      "향기도예와 갤러리풍경 주변에서 도자기 조각의 형태와 문양을 확인하고, 숨겨진 암호를 입력하라.",
    rule: [
      "도자기의 문양, 파손 방향, 남은 흔적을 함께 확인하라.",
      "정답은 다른 제작자가 완성할 예정인 임시 퍼즐이다.",
    ],
    hints: [
      "깨진 흔적이 자연스럽게 생긴 것인지, 누군가 일부러 낸 것인지 비교하라.",
      "문양은 단순 장식이 아니라 두 사람의 약속을 가리킨다.",
    ],
    answer: "TEMP1",
  },
  {
    id: "story-2",
    type: "story",
    chapter: "두 번째 기록",
    title: "시작일 뿐입니다",
    paragraphs: [
      "당신은 가장 먼저 증거 사진 속 깨진 도자기를 조사하기로 했다.",
      "사진만으로는 알 수 없는 무언가가 있을 것이라는 예감이 들었다.",
      "도자기는 산산이 부서져 있었지만, 단순한 사고로 깨진 물건처럼 보이지 않았다.",
      "파편의 단면은 지나치게 날카로웠고, 일부 조각에는 강한 충격을 받은 흔적이 선명하게 남아 있었다.",
      "실수로 떨어뜨린 것이 아니라 누군가 분명한 의도를 가지고 내리쳐 깨뜨린 듯한 모습이었다.",
      "더욱 이상한 점은 따로 있었다.",
      "도자기의 바닥면 안쪽.",
      "평소라면 쉽게 눈에 띄지 않을 위치에 종이 조각 하나가 끼워져 있었던 것이다.",
      "조심스럽게 펼쳐본 쪽지에는 단 한 문장만 적혀 있었다.",
      "『시작일 뿐입니다.』",
      "짧고 단순한 문장이었지만, 그 순간 등골을 타고 서늘한 감각이 스쳐 지나갔다.",
      "누군가가 물건을 망가뜨렸다. 그리고 그 사실을 누군가 발견하기를 바라는 듯 이런 문구까지 남겨두었다.",
      "이것은 단순한 장난이 아니다.",
      "더구나 ‘시작’이라는 말은 앞으로도 같은 일이 계속될 것이라는 의미처럼 들렸다.",
      "당신은 다시 책상 위에 펼쳐진 증거 사진들을 바라보았다.",
      "처음에는 서로 관련 없는 물건이라 생각했다. 하지만 이제는 달랐다.",
      "이 모든 물건들이 하나의 사건으로 연결되어 있다는 불길한 예감이 들었다.",
      "정체를 숨긴 소녀는 왜 당신에게 도움을 요청한 것일까.",
      "그리고 누가, 무슨 이유로 이런 일들을 벌이고 있는 것일까.",
      "당신은 무심코 창밖을 바라보았다.",
      "며칠 뒤면 왕실의 혼례가 열린다.",
      "그러나 어쩐지, 그 혼례가 무사히 치러지지 않을 것만 같은 불길한 기분이 가슴 한켠에 자리 잡기 시작했다.",
    ],
    buttonText: "다음 단서로 이동",
  },
  {
    id: "mission-2",
    type: "mission",
    missionId: 2,
    chapter: "미션 2",
    title: "끊어진 매듭",
    location: "나정희 규방공예",
    piece: "끊어진 약속 매듭",
    intro:
      "두 번째 단서는 끊어진 약속 매듭과 사라진 색실이다. A와 전하가 어린 시절 주고받았던 매듭 장식은 혼인을 약속하는 상징이었지만, 현재는 색실 일부가 사라진 채 발견되었다.",
    instruction:
      "규방공예 공방 주변에서 의궤 속 문양과 실제 매듭의 색 배열을 비교하고, 원래 의미를 복원하라.",
    rule: [
      "사라진 색실이 무엇인지 확인하라.",
      "색 배열이 바뀌면 문양의 의미도 달라진다.",
      "정답은 다른 제작자가 완성할 예정인 임시 퍼즐이다.",
    ],
    hints: [
      "없어진 색을 찾는 것보다, 왜 그 색이 없어졌는지가 중요하다.",
      "원래의 배열은 A가 약속을 저버린 것이 아니라 지키려 했음을 보여준다.",
    ],
    answer: "TEMP2",
  },
  {
    id: "story-3",
    type: "story",
    chapter: "세 번째 기록",
    title: "그대라는 호칭",
    paragraphs: [
      "도자기 사건을 조사하던 당신은 다음 단서를 따라 끊어진 매듭의 기록을 살펴보았다.",
      "기록에 따르면 이 매듭은 왕 이현이 어린 시절부터 소중히 간직해 온 물건이었다.",
      "평범한 장식품이 아니라, 특정한 사람과의 약속을 상징하는 물건이었다고 한다.",
      "그런 물건이 누군가에 의해 날카롭게 끊어져 있었다.",
      "실수로 풀어진 흔적은 아니었다.",
      "누군가 의도적으로 잘라낸 것이 분명했다.",
      "당신은 증거 사진을 유심히 살펴보다 매듭을 보관하던 함의 안쪽에서 작은 종이 조각 하나를 발견했다.",
      "바랜 종이 위에는 짧은 문장이 적혀 있었다.",
      "『전하의 마음은 어찌 늘 그대에게만 머무는지요.』",
      "순간 당신의 손이 멈췄다.",
      "단순한 원망. 혹은 질투. 그런 감정이 묻어나는 문장이었다.",
      "하지만 이상한 점은 따로 있었다.",
      "‘그대’라는 호칭이었다.",
      "왕실 기록을 다루는 당신은 알고 있었다.",
      "궁 안에서 연이를 향해 ‘그대’라는 표현을 사용하는 사람은 거의 없었다.",
      "그 호칭은 지나치게 사적인 표현이었다.",
      "그리고 당신이 알기로, 평소 연이를 향해 그런 말을 사용하던 사람은 단 한 명뿐이었다.",
      "왕비 후보 서화.",
      "연이와 함께 간택전에 참여하고 있는 또 다른 후보.",
      "물론 이것만으로 그녀를 범인이라 단정할 수는 없었다.",
      "당신은 천천히 그 이름을 되뇌었다.",
      "지금까지는 정체를 알 수 없는 누군가의 짓이라 생각했다.",
      "그러나 이제는 달랐다.",
      "사건의 배후에 있는 인물이 조금씩 모습을 드러내기 시작하고 있었다.",
    ],
    buttonText: "나녕공방으로 이동",
  },
  {
    id: "mission-3",
    type: "mission",
    missionId: 3,
    chapter: "미션 3",
    title: "불을 지나 남은 색",
    location: "나녕공방",
    piece: "그을린 팔찌 조각",
    image: "/mission/mission3-nanyeong-crop.png",
    intro:
      "왕이 A에게 전하려 했던 팔찌는 간택 직전 사라졌다. 다시 발견된 팔찌 조각은 검게 그을려 있었지만, 주변에는 아직 팔찌의 원래 배열을 알려주는 흔적이 남아 있었다.",
    instruction:
      "나녕공방 앞 장식 조각판에서 아래 그림과 같은 색 조각 구역을 찾아라. 그 구역의 가운데에 있는 가장 어두운 조각을 기준으로 삼아라.",
    rule: [
      "기준 조각의 상하좌우에 있는 문양을 불길이 지나간 순서대로 읽어라.",
      "불길의 순서: 아래 → 왼쪽 → 위 → 오른쪽",
      "문양표: 꽃 = 1 / 물결 = 2 / 돌조각 = 3 / 나비 = 4 / 호랑이 = 5",
      "정답은 네 자리 숫자다.",
    ],
    hints: [
      "아래 그림은 정답지가 아니라, 현장에서 같은 구역을 찾기 위한 참고 이미지다.",
      "가운데에 있는 가장 어두운 조각을 먼저 찾아라.",
      "상하좌우를 그냥 읽는 것이 아니라 아래 → 왼쪽 → 위 → 오른쪽 순서로 읽어야 한다.",
      "문양 이름을 쓰지 말고 문양표의 숫자로 바꾸어 입력한다.",
    ],
    answer: "1245",
  },
  {
    id: "story-4",
    type: "story",
    chapter: "네 번째 기록",
    title: "너무 빠른 종결",
    paragraphs: [
      "사라진 팔찌에 대한 조사를 이어가던 당신은 마침내 중요한 증언 하나를 확보하게 된다.",
      "오랫동안 망설이던 한 궁녀는 주변을 몇 번이나 살핀 뒤에야 조심스럽게 입을 열었다.",
      "“며칠 전 밤이었습니다. 우연히 후원을 지나던 중, 서화의 시녀가 무언가를 품에 숨긴 채 급히 지나가는 모습을 보았습니다.”",
      "“당시에는 대수롭지 않게 여겼으나... 지금 생각해보면 팔찌였을지도 모르겠습니다.”",
      "그 말을 들은 순간, 지금까지 모아온 단서들이 머릿속에서 하나로 이어지기 시작했다.",
      "게다가 매듭 사건 당시 발견된 쪽지의 필체와 표현 역시 서화를 자연스럽게 떠올리게 만들었다.",
      "물론 확실한 증거는 없었다.",
      "그러나 지금까지 드러난 정황만 놓고 본다면 가장 유력한 인물은 분명 서화였다.",
      "당신은 서둘러 사건 기록을 정리한 뒤, 평소 누구보다 신뢰하던 선배 감찰관 청휘를 찾아갔다.",
      "청휘는 당신이 처음 감찰 업무를 맡았을 때부터 곁에서 가르침을 주었던 인물이었다.",
      "누구보다 깐깐했고, 작은 모순 하나도 절대 그냥 넘어가지 않는 사람.",
      "그래서 궁 안에서는 그를 두고 ‘한 번 물면 놓지 않는 사냥개’라 부르곤 했다.",
      "당신은 지금까지 수집한 증거와 증언들을 모두 설명했다.",
      "“선배님, 범인을 찾은 것 같습니다.”",
      "잠시 침묵이 흘렀다.",
      "청휘는 기록을 천천히 훑어보더니 뜻밖에도 작게 웃음을 터뜨렸다.",
      "“그래. 수고했군.”",
      "당신은 순간 당황했다.",
      "칭찬에 인색하기로 유명한 청휘가 이렇게 쉽게 인정하는 모습은 처음이었기 때문이다.",
      "“그렇다면... 서화를 조사해야 하지 않겠습니까?”",
      "당신의 질문에 청휘는 고개를 저었다.",
      "“충분하네.”",
      "“예?”",
      "“이미 범인이 드러났지 않은가. 혼례도 얼마 남지 않았는데 더 이상 일을 키울 필요는 없네.”",
      "그 말은 어딘가 이상했다.",
      "평소의 청휘였다면 증언 하나만으로 사건을 종결하지 않았을 것이다.",
      "오히려 시녀를 불러 심문하고, 그날 밤의 행적을 캐묻고, 며칠 밤을 새워서라도 진실을 확인하려 했을 사람이다.",
      "하지만 오늘의 청휘는 달랐다.",
      "마치 이미 결론을 정해놓은 사람처럼.",
      "마치 사건이 더 깊어지는 것을 원하지 않는 사람처럼.",
      "“남은 일은 윗분들께 맡기게. 자네는 이 정도면 충분히 제 몫을 했네.”",
      "청휘는 기록철을 덮으며 대화를 끝내려 했다.",
      "당신은 고개를 끄덕였지만, 왠지 모를 위화감이 가슴 한구석에 남았다.",
      "분명 지금까지의 단서는 모두 서화를 가리키고 있었다.",
      "그런데 어째서일까.",
      "사건을 종결하려는 청휘의 모습이, 처음으로 낯설게 느껴졌다.",
    ],
    buttonText: "길 위의 단서 확인",
  },
  {
    id: "mission-4",
    type: "mission",
    missionId: 4,
    chapter: "길거리 단서",
    title: "등불에 남은 팔찌의 순서",
    location: "공방거리 가로등",
    piece: "등불 문양의 암호",
    intro:
      "나녕공방에서 얻은 네 자리 숫자는 팔찌의 완성된 암호가 아니었다. 그 숫자는 다음 길 위의 등불을 읽는 순서였다.",
    instruction:
      "가로등에 새겨진 정면의 큰 사각 문양을 찾아라. 옆면은 보지 말고 정면 문양만 확인한다.",
    rule: [
      "나녕공방에서 얻은 암호 1245의 순서대로 아래 항목을 세어 네 자리 숫자를 완성하라.",
      "1 = 중앙 붉은 꽃의 큰 꽃잎 수",
      "2 = 꽃 주변의 청록색 문양 수",
      "3 = 분홍색 테두리의 겹 수",
      "4 = 중앙 꽃의 청록색 꽃잎 수",
      "5 = 노란색 선으로 이루어진 도형의 면 수",
      "정답은 네 자리 숫자다.",
    ],
    hints: [
      "나녕공방에서 얻은 1245는 이번 문제의 정답이 아니라, 항목을 읽는 순서다.",
      "1245이므로 1번, 2번, 4번, 5번 항목만 사용한다.",
      "옆면 문양은 보지 말고 정면의 큰 사각 문양만 확인한다.",
      "각 항목을 세어 나온 숫자를 순서대로 이어 붙여라.",
    ],
    answer: "8888",
  },
  {
    id: "story-5",
    type: "story",
    chapter: "다섯 번째 기록",
    title: "질투와 범죄 사이",
    paragraphs: [
      "당신은 지금까지의 조사 결과를 정리하며 사건을 마무리할 준비를 하고 있었다.",
      "모든 정황은 서화를 가리키고 있었다.",
      "깨진 도자기, 끊어진 매듭, 사라진 팔찌, 그리고 그녀의 시녀를 목격했다는 궁녀의 증언까지.",
      "비록 결정적인 증거는 없었지만, 적어도 누군가를 의심해야 한다면 가장 먼저 이름이 오를 사람은 서화였다.",
      "사건 기록을 정리하던 당신은 마지막으로 연이와 관련된 자료들을 확인하기 위해 조사실 기록 보관함을 열었다.",
      "혹시 놓친 부분이 없는지 확인하기 위해서였다.",
      "그러나 기록철을 펼친 순간, 이상한 점을 발견했다.",
      "연이의 거처 배치도가 사라져 있었다.",
      "처음에는 단순한 착오라 생각했다.",
      "하지만 일정표를 찾으려 했을 때도 마찬가지였다.",
      "며칠 전까지 분명 보관되어 있던 일정 기록 일부가 통째로 없어져 있었다.",
      "시녀들의 명단 또한 누락된 부분이 눈에 띄었다.",
      "당신은 서둘러 다른 보관함까지 확인했지만 결과는 같았다.",
      "누군가가 특정 기록들만 골라 가져간 것이 분명했다.",
      "잠시 기록철을 내려놓은 당신은 생각에 잠겼다.",
      "서화가 범인이라고 가정하면 모든 사건이 설명될 것 같았다.",
      "질투심 때문에 도자기를 깨뜨리고, 매듭을 끊고, 팔찌를 숨겼다.",
      "충분히 가능한 이야기였다.",
      "하지만 거처 배치도는?",
      "일정표는?",
      "시녀 명단은?",
      "그것들은 추억의 물건도 아니었고, 연인을 향한 질투와도 관계가 없는 것들이었다.",
      "오히려 누군가의 생활을 감시하고 추적하기 위해 필요한 자료들에 가까웠다.",
      "당신은 무심코 사라진 기록들의 목록을 다시 훑어보았다.",
      "그리고 문득 등골이 서늘해졌다.",
      "질투 때문에 물건을 망가뜨리는 것과 사람의 동선을 조사하는 것은 전혀 다른 문제였다.",
      "전자라면 감정에 휩쓸린 행동이다.",
      "하지만 후자는 목적이 있는 행동이다.",
      "누군가가 연이의 일상을 파악하고 있다.",
      "언제 어디에 있는지.",
      "누구와 함께 움직이는지.",
      "어떤 경로로 거처를 드나드는지.",
      "당신은 천천히 자리에서 일어났다.",
      "처음에는 단순한 애정 문제라고 생각했다.",
      "질투와 원망, 그리고 어리석은 경쟁심이 만들어낸 사건이라고 생각했다.",
      "하지만 이제는 아니었다.",
      "이 사건은 누군가의 추억을 망가뜨리는 데서 끝나지 않는다.",
      "당신은 처음으로, 누군가가 익명의 발신인 자체를 노리고 있을지도 모른다는 불길한 예감을 느끼기 시작했다.",
    ],
    buttonText: "종이노리로 이동",
  },
  {
    id: "mission-5",
    type: "mission",
    missionId: 5,
    chapter: "미션 5",
    title: "피어나는 궤적",
    location: "꽃을 담다 종이노리",
    piece: "가짜 서찰의 꽃 단서",
    intro:
      "문제의 서찰은 A가 쓴 것으로 알려져 있었다. 그러나 종이의 질감과 접힌 방향, 그리고 꽃에 남은 색의 배열은 다른 사실을 말하고 있었다.",
    instruction:
      "꽃을 담다 종이노리 매장의 상단 문양과 매장 앞 데크에 놓인 꽃을 확인하라.",
    contentBlocks: [
      {
        type: "text",
        text: "먼저 매장 정면 상단의 장식 문양을 확인하라.",
      },
      {
        type: "text",
        text: "가장 반복해서 나타나는 문양이 무엇인지 찾는다.",
      },
      {
        type: "image",
        src: "/mission/mission5-jonginori-pattern.png",
        alt: "피어나는 궤적 참고 이미지 1",
      },
      {
        type: "text",
        text: "그 문양이 꽃이라면, 매장 앞 데크에 놓인 꽃의 색을 왼쪽부터 오른쪽 순서대로 읽어라.",
      },
      {
        type: "image",
        src: "/mission/mission5-jonginori-flowers.png",
        alt: "피어나는 궤적 참고 이미지 2",
      },
      {
        type: "text",
        text: "색마다 대응되는 단어를 조합해 단서를 완성하라.",
      },
      {
        type: "rule",
        lines: [
          "분홍 = 날",
          "노랑 = 두",
          "하양 = 하나의",
          "빨강 = 이름",
          "정답은 완성된 문장이다.",
        ],
      },
    ],
    hints: [
      "상단 장식 문양에서 가장 많이 반복되는 모양을 먼저 확인하라.",
      "가장 반복되는 문양이 꽃이라면, 데크 앞 꽃의 색 순서를 읽으면 된다.",
      "색 이름을 입력하는 것이 아니라, 색에 대응되는 단어를 조합해야 한다.",
      "띄어쓰기는 정답 판정에 영향을 주지 않는다.",
    ],
    answer: "하나의날두이름",
  },
  {
    id: "story-6",
    type: "story",
    chapter: "여섯 번째 기록",
    title: "찢어진 기록",
    mediaNote: "이 구간은 추후 짧은 영상 또는 이미지 컷으로 대체 가능",
    paragraphs: [
      "가짜 서찰의 흔적은 궁 안의 문서 양식과 간택 기록을 잘 아는 사람을 가리키고 있었다.",
      "당신은 더 깊은 기록을 찾던 중, 찢어진 초상화와 오래된 혈연 기록의 흔적을 발견한다.",
      "초상화의 뒷면에는 왕비 후보 C와 감찰관 D의 관계를 암시하는 기록이 남아 있었다.",
      "사건의 방향이 다시 바뀌기 시작한다.",
    ],
    buttonText: "찢어진 초상의 단서로 이동",
  },
  {
    id: "mission-6",
    type: "mission",
    missionId: 6,
    chapter: "길거리 단서",
    title: "찢어진 초상의 방향",
    location: "길거리",
    piece: "찢어진 초상 조각",
    intro: "초상화의 일부는 공방거리의 길 위에 남겨진 문양과 이어져 있었다.",
    instruction: "길 위의 단서를 확인하고 찢어진 초상화의 방향을 복원하라.",
    rule: [
      "초상화 조각의 방향과 현장 문양을 비교하라.",
      "정답은 다른 제작자가 완성할 예정인 임시 퍼즐이다.",
    ],
    hints: [
      "초상화는 앞면만 보지 말고 뒷면 기록까지 생각해야 한다.",
      "누가 사랑했고, 누가 이용했는지를 구분하라.",
    ],
    answer: "TEMP6",
  },
  {
    id: "story-7",
    type: "story",
    chapter: "일곱 번째 기록",
    title: "오라버니",
    paragraphs: [
      "연이의 기록이 사라진 이유를 생각할수록 의문은 더욱 커져만 갔다.",
      "결국 당신은 다시 청휘를 찾아가기로 했다.",
      "청휘는 담담한 표정으로 차를 마시고 있었다.",
      "당신은 곧장 본론을 꺼냈다.",
      "“후보 연이의 거처 배치도와 일정표가 사라졌습니다.”",
      "청휘는 눈 하나 깜빡하지 않았다.",
      "“그래서?”",
      "“누군가 의도적으로 가져간 것 같습니다.”",
      "잠시 침묵이 흘렀다.",
      "하지만 돌아온 대답은 예상 밖이었다.",
      "“별일 아닐세.”",
      "당신은 순간 귀를 의심했다.",
      "“예?”",
      "“혼례 준비 중에는 흔한 일이지. 사람도 많고 드나드는 문서도 많으니 기록 몇 장 없어지는 일이야 생길 수 있네.”",
      "이상했다.",
      "너무 이상했다.",
      "청휘는 그런 사람이 아니었다.",
      "그 누구보다 기록의 중요성을 잘 아는 감찰관이었다.",
      "예전의 청휘라면 기록이 사라졌다는 말만 들어도 관련자를 모두 불러 조사했을 것이다.",
      "그런데 지금은 마치 더 이상 이 이야기를 꺼내지 말라는 듯 행동하고 있었다.",
      "당신은 천천히 청휘를 바라보았다.",
      "그리고 마침내 입을 열었다.",
      "“감찰관님.”",
      "청휘의 시선이 당신에게 향했다.",
      "“왜 후보 연이의 자료를 유출하셨습니까?”",
      "방 안의 공기가 무겁게 가라앉았다.",
      "청휘는 잠시 아무 말도 하지 않았다.",
      "이윽고 입가에 옅은 미소를 띠며 물었다.",
      "“증거가 있나?”",
      "“선배님은 사건을 지나치게 빨리 종결하려 했습니다.”",
      "“그것만으로는 부족하지.”",
      "맞는 말이었다.",
      "모든 정황이 청휘를 가리키고 있었지만, 당신은 그것을 증명할 수 없어 분노가 치밀었다.",
      "청휘의 목소리는 여전히 차분했다.",
      "하지만 당신은 확신하고 있었다.",
      "무언가가 있다.",
      "분명 무언가를 숨기고 있다.",
      "바로 그 순간.",
      "문이 열리는 소리가 들렸다.",
      "당신과 청휘가 동시에 고개를 돌렸다.",
      "문 앞에는 서화가 서 있었다.",
      "서화는 당신이 아닌 청휘를 바라보았다.",
      "그리고 떨리는 목소리로 말했다.",
      "“오라버니... 이제 그만하십시오.”",
      "순간 머릿속이 새하얘졌다.",
      "오라버니?",
      "방 안에는 정적만이 흘렀다.",
      "당신은 믿을 수 없다는 듯 두 사람을 번갈아 바라보았다.",
      "청휘는 아무런 대답도 하지 않았다.",
      "그 침묵이야말로 가장 확실한 대답이었다.",
      "“저는 분명 잘못했습니다.”",
      "서화가 천천히 말을 이었다.",
      "“연이가 미웠습니다. 부러웠고, 질투도 났습니다. 그래서 추억이 담긴 물건들을 망가뜨렸습니다.”",
      "서화의 목소리는 점점 떨리기 시작했다.",
      "“하지만 사람을 해치려 한 적은 없습니다.”",
      "그녀는 눈을 감았다가 다시 뜨며 말을 이어갔다.",
      "“연이는 제 경쟁자이기 전에, 어린 시절부터 함께 궁에서 자라온 친구입니다. 함께 울고 웃으며 의지했던 사람입니다.”",
      "당신은 아무 말도 하지 못했다.",
      "지금까지의 모든 증거가 하나씩 새로운 의미를 갖기 시작했다.",
      "도자기를 깨뜨린 사람도.",
      "매듭을 끊은 사람도.",
      "팔찌를 숨긴 사람도.",
      "분명 서화가 맞다.",
      "하지만 연이를 해치려는 사람은 아니었다.",
      "그렇다면 남는 사람은 단 한 명뿐이었다.",
      "청휘는 천천히 자리에서 일어났다.",
      "그리고 처음으로 차가운 눈빛을 드러냈다.",
      "그 순간, 당신은 깨달았다.",
      "지금까지 쫓아온 것은 질투에 휩싸인 한 여인의 흔적이 아니었다.",
      "그 뒤에 숨어 있던 진짜 범인의 그림자였다.",
    ],
    buttonText: "마지막 어찰 확인",
  },
  {
    id: "mission-7",
    type: "mission",
    missionId: 7,
    chapter: "마지막 길거리 단서",
    title: "마지막 어찰",
    location: "길거리",
    piece: "마지막 어찰",
    intro:
      "D의 음모를 밝히기 위해서는 마지막 암호가 필요하다. 지금까지 모은 단서들이 하나의 답으로 이어진다.",
    instruction: "누적된 단서들을 조합해 마지막 어찰의 암호를 완성하라.",
    rule: [
      "도자기, 매듭, 팔찌, 등불, 서찰, 초상화의 단서를 다시 확인하라.",
      "정답은 다른 제작자가 완성할 예정인 임시 퍼즐이다.",
    ],
    hints: [
      "각 미션의 답을 그대로 쓰는 것이 아니라, 마지막 어찰의 순서에 맞게 재배열해야 한다.",
      "D가 숨기려 한 것은 물건이 아니라 사람의 동선과 기록이다.",
    ],
    answer: "TEMP7",
  },
  {
    id: "ending",
    type: "ending",
    title: "혼례의 진실",
    paragraphs: [
      "마지막 암호가 해독되는 순간, 흩어져 있던 단서들은 하나의 진실로 이어졌다.",
      "깨진 도자기.",
      "끊어진 매듭.",
      "사라진 팔찌.",
      "찢겨진 연서.",
      "그리고 사라진 기록들.",
      "지금까지의 모든 사건 뒤에는 감찰관 청휘의 음모가 숨어 있었다.",
      "청휘는 자신의 혈육인 서화를 왕비의 자리에 앉히고, 그 권세를 이용해 왕실의 실권을 손에 넣으려 했다.",
      "서화의 질투심을 부추기고 이용하며 사건을 조작했고, 마침내 연이를 제거하려는 계획까지 세웠다.",
      "모든 진실이 밝혀지자 이현은 큰 충격에 빠졌다.",
      "그동안 자신이 들었던 소문들.",
      "연이를 의심하게 만들었던 수많은 이야기들.",
      "그리고 두 사람의 사이를 갈라놓았던 사건들.",
      "그 모든 것이 누군가의 손에 의해 조작된 것이었다.",
      "이현은 비로소 자신의 곁을 묵묵히 지켜온 연이를 바라보았다.",
      "연이 또한 아무 말 없이 그의 시선을 받아들였다.",
      "오랫동안 쌓여 있던 오해와 의심은 그렇게 조금씩 사라져 갔다.",
      "청휘는 간택 총책임자의 자리에서 물러나 조사를 받게 되었다.",
      "서화 역시 간택에서 제외되었고, 궁을 떠나게 되었다.",
      "궁을 떠나는 날.",
      "서화는 마지막으로 연이를 찾아왔다.",
      "한동안 아무 말도 하지 못하던 그녀는 천천히 고개를 숙였다.",
      "“미안했습니다.”",
      "“...”",
      "“그대를 미워한다고 생각했어요. 하지만 지금 와서 보니, 사실은 제가 가진 것을 잃을까 두려웠던 것 같습니다.”",
      "연이는 잠시 그녀를 바라보았다.",
      "어린 시절 함께 궁에 들어와 울고 웃으며 자라온 시간들이 스쳐 지나갔다.",
      "“서화가 한 일을 없었던 일로 할 수는 없어요.”",
      "서화의 어깨가 작게 떨렸다.",
      "“하지만 어떤 마음으로 그랬는지는 알 수 있어요. 이해할 수 있어요.”",
      "그 말에 서화는 끝내 눈물을 보이고 말았다.",
      "연이는 더 이상 아무 말도 하지 않았다.",
      "그것이 용서도, 원망도 아닌 두 사람만의 작별이었다.",
      "며칠 뒤.",
      "왕실에는 마침내 혼례가 열렸다.",
      "화려한 장식들 사이에는 익숙한 물건들이 놓여 있었다.",
      "정성껏 복원된 도자기.",
      "다시 이어진 약속의 매듭.",
      "되찾은 팔찌.",
      "그리고 새롭게 복원된 추억의 기록들.",
      "한때 누군가의 질투와 욕망으로 훼손되었던 물건들은 이제 두 사람의 새로운 시작을 축복하는 증표가 되었다.",
      "혼례가 끝난 뒤, 이현과 연이는 사람들 틈에서 잠시 당신을 바라보았다.",
      "두 사람은 아무 말 없이 미소 지었다.",
      "그것만으로 충분했다.",
      "당신이 밝혀낸 진실 덕분에, 잃어버릴 뻔했던 믿음과 약속은 다시 제자리를 찾을 수 있었으니까.",
      "그렇게 궁 안에 흩어졌던 추억들은 마침내 하나의 이야기로 완성되었다.",
    ],
    buttonText: "클리어 인증 보기",
  },
];

const workshopRecommendations = {
  1: {
    title: "도예 감식형",
    workshop: "향기도예 / 도예 공방",
    statName: "흙과 문양 감식",
    description:
      "깨진 도자기의 형태와 파손 흔적을 빠르게 파악했습니다. 형태, 질감, 문양을 비교하며 물건의 진짜 의미를 읽는 데 강한 타입입니다.",
    recommendedCrafts: [
      "도자기 핸드빌딩",
      "향 도자기 만들기",
      "타일 문양 꾸미기",
    ],
  },
  2: {
    title: "규방공예 추천형",
    workshop: "나정희 규방공예 / 색실·매듭 공방",
    statName: "색실 관찰 감각",
    description:
      "끊어진 매듭의 색실을 빠르게 파악했습니다. 색, 실, 장식처럼 섬세한 시각 단서에 강한 타입입니다.",
    recommendedCrafts: [
      "매듭 팔찌 만들기",
      "색실 장식 만들기",
      "규방공예 소품 체험",
    ],
  },
  3: {
    title: "칠보 장신구 해석형",
    workshop: "나녕공방 / 장신구 공방",
    statName: "색 배열 복원 감각",
    description:
      "불에 그을린 장신구 조각에서 남은 색의 배열을 빠르게 읽어냈습니다. 색, 금속, 장신구, 암호 조합에 강한 타입입니다.",
    recommendedCrafts: ["팔찌 만들기", "칠보 장식 체험", "약속 증표 만들기"],
  },
  5: {
    title: "종이꽃 해석형",
    workshop: "종이노리 / 종이 공방",
    statName: "종이 단서 해석",
    description:
      "종이의 접힘과 숨은 궤적을 빠르게 비교했습니다. 서찰, 한지, 종이꽃처럼 이야기와 형태가 함께 담긴 공예에 잘 어울립니다.",
    recommendedCrafts: ["종이꽃 만들기", "한지 엽서 만들기", "서찰 카드 제작"],
  },
};

function getFastestWorkshop(missionTimes) {
  const craftMissionIds = [1, 2, 3, 5];

  const entries = Object.entries(missionTimes)
    .map(([missionId, seconds]) => [Number(missionId), seconds])
    .filter(([missionId]) => craftMissionIds.includes(missionId));

  if (entries.length === 0) {
    return {
      title: "서찰 조사관형",
      workshop: "공방거리 종합 체험",
      statName: "종합 추리 감각",
      description:
        "여러 단서를 균형 있게 따라간 조사관입니다. 공방거리의 다양한 체험을 함께 둘러보는 코스가 잘 어울립니다.",
      recommendedCrafts: ["종이꽃 만들기", "매듭 소품 만들기", "도예 체험"],
    };
  }

  entries.sort((a, b) => a[1] - b[1]);
  const fastestMissionId = entries[0][0];

  return workshopRecommendations[fastestMissionId];
}

function normalizeAnswer(value) {
  return String(value).trim().toLowerCase().replace(/\s/g, "");
}

function sanitizeScreen(screen) {
  const allowedScreens = [
    "landing",
    "code",
    "team",
    "flow",
    "progress",
    "clear",
    "leaderboard",
  ];

  if (allowedScreens.includes(screen)) return screen;

  const legacyScreens = ["teaser", "mission", "piece", "trait"];
  if (legacyScreens.includes(screen)) return "flow";

  return "landing";
}

function clampFlowIndex(index) {
  if (!Number.isInteger(index)) return 0;
  if (index < 0) return 0;
  if (index >= storyFlow.length) return 0;
  return index;
}

function App() {
  const [screen, setScreen] = useState("landing");
  const [inputCode, setInputCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [flowIndex, setFlowIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [openedHints, setOpenedHints] = useState([]);
  const [hintCount, setHintCount] = useState(0);
  const [pieces, setPieces] = useState([]);
  const [message, setMessage] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [clearTimeSeconds, setClearTimeSeconds] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [isLoaded, setIsLoaded] = useState(false);
  const [missionStartTime, setMissionStartTime] = useState(null);
  const [missionTimes, setMissionTimes] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);

  const currentNode = storyFlow[flowIndex] || storyFlow[0];

  const missionNodes = useMemo(
    () => storyFlow.filter((node) => node.type === "mission"),
    [],
  );

  const currentMissionOrder = useMemo(() => {
    if (currentNode.type === "mission") {
      return (
        missionNodes.findIndex((mission) => mission.id === currentNode.id) + 1
      );
    }

    const passedMissionCount = missionNodes.filter((mission) => {
      const missionFlowIndex = storyFlow.findIndex(
        (node) => node.id === mission.id,
      );
      return missionFlowIndex <= flowIndex;
    }).length;

    return Math.max(1, passedMissionCount);
  }, [currentNode.id, currentNode.type, flowIndex, missionNodes]);

  const workshopResult = getFastestWorkshop(missionTimes);

  useEffect(() => {
    if (import.meta.env.DEV) {
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(OLD_SAVE_KEY);

      setScreen("landing");
      setInputCode("");
      setTeamName("");
      setFlowIndex(0);
      setAnswer("");
      setOpenedHints([]);
      setHintCount(0);
      setPieces([]);
      setMessage("");
      setStartTime(null);
      setClearTimeSeconds(null);
      setMissionStartTime(null);
      setMissionTimes({});
      setSelectedRecord(null);
      setIsLoaded(true);
      return;
    }

    const saved = localStorage.getItem(SAVE_KEY);

    if (saved) {
      try {
        const data = JSON.parse(saved);

        setScreen(sanitizeScreen(data.screen));
        setInputCode(data.inputCode || "");
        setTeamName(data.teamName || "");
        setFlowIndex(clampFlowIndex(data.flowIndex));
        setOpenedHints(data.openedHints || []);
        setHintCount(data.hintCount || 0);
        setPieces(data.pieces || []);
        setStartTime(data.startTime || null);
        setClearTimeSeconds(data.clearTimeSeconds || null);
        setMissionStartTime(data.missionStartTime || null);
        setMissionTimes(data.missionTimes || {});
      } catch {
        localStorage.removeItem(SAVE_KEY);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (import.meta.env.DEV) return;

    const saveData = {
      screen,
      inputCode,
      teamName,
      flowIndex,
      openedHints,
      hintCount,
      pieces,
      startTime,
      clearTimeSeconds,
      missionStartTime,
      missionTimes,
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  }, [
    isLoaded,
    screen,
    inputCode,
    teamName,
    flowIndex,
    openedHints,
    hintCount,
    pieces,
    startTime,
    clearTimeSeconds,
    missionStartTime,
    missionTimes,
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const elapsedSeconds =
    startTime && !clearTimeSeconds
      ? Math.floor((now - startTime) / 1000)
      : clearTimeSeconds || 0;

  const handleCodeSubmit = () => {
    const normalizedCode = inputCode.trim().toUpperCase();

    if (!gameConfig.validCodes.includes(normalizedCode)) {
      setMessage(
        "입장 코드가 올바르지 않습니다. 서찰의 봉인을 다시 확인해주세요.",
      );
      return;
    }

    setMessage("");
    setScreen("team");
  };

  const handleTeamSubmit = () => {
    if (teamName.trim().length < 2) {
      setMessage("조사관 이름은 2글자 이상 입력해주세요.");
      return;
    }

    setMessage("");
    setFlowIndex(0);
    setScreen("flow");
  };

  const finishInvestigation = () => {
    if (!clearTimeSeconds) {
      const endTime = Date.now();
      const totalSeconds = startTime
        ? Math.max(1, Math.floor((endTime - startTime) / 1000))
        : 0;

      setClearTimeSeconds(totalSeconds);
    }

    setMessage("");
    setScreen("clear");
  };

  const goNextFlow = () => {
    if (currentNode.type === "ending") {
      finishInvestigation();
      return;
    }

    const nextIndex = Math.min(flowIndex + 1, storyFlow.length - 1);
    const nextNode = storyFlow[nextIndex];

    if (currentNode.type === "teaser" && !startTime) {
      setStartTime(Date.now());
    }

    if (nextNode?.type === "mission") {
      setMissionStartTime(Date.now());
    }

    setAnswer("");
    setMessage("");
    setFlowIndex(nextIndex);
  };

  const openHint = (hintIndex) => {
    const hintKey = `${currentNode.id}-${hintIndex}`;

    if (!openedHints.includes(hintKey)) {
      setOpenedHints((prev) => [...prev, hintKey]);
      setHintCount((prev) => prev + 1);
    }
  };

  const isHintOpen = (hintIndex) => {
    const hintKey = `${currentNode.id}-${hintIndex}`;
    return openedHints.includes(hintKey);
  };

  const submitMissionAnswer = () => {
    if (currentNode.type !== "mission") return;

    const isTemporaryMission = currentNode.answer?.startsWith("TEMP");

    if (!isTemporaryMission) {
      const userAnswer = normalizeAnswer(answer);
      const correctAnswer = normalizeAnswer(currentNode.answer);

      if (userAnswer !== correctAnswer) {
        setMessage(
          "아직 진실에 닿지 못했습니다. 현장의 단서와 순서를 다시 확인해보세요.",
        );
        return;
      }
    }

    const solvedAt = Date.now();
    const spentSeconds = missionStartTime
      ? Math.max(1, Math.floor((solvedAt - missionStartTime) / 1000))
      : 0;

    setMissionTimes((prev) => ({
      ...prev,
      [currentNode.missionId]: spentSeconds,
    }));

    setPieces((prev) =>
      prev.includes(currentNode.piece) ? prev : [...prev, currentNode.piece],
    );

    const currentMissionListIndex = missionNodes.findIndex(
      (mission) => mission.id === currentNode.id,
    );

    const isLastMission = currentMissionListIndex === missionNodes.length - 1;

    if (isLastMission && !clearTimeSeconds) {
      const endTime = Date.now();
      const totalSeconds = startTime
        ? Math.max(1, Math.floor((endTime - startTime) / 1000))
        : spentSeconds;

      setClearTimeSeconds(totalSeconds);
    }

    setAnswer("");
    setMessage("");
    goNextFlow();
  };

  const resetGame = () => {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(OLD_SAVE_KEY);

    setScreen("landing");
    setInputCode("");
    setTeamName("");
    setFlowIndex(0);
    setAnswer("");
    setOpenedHints([]);
    setHintCount(0);
    setPieces([]);
    setMessage("");
    setStartTime(null);
    setClearTimeSeconds(null);
    setMissionStartTime(null);
    setMissionTimes({});
    setSelectedRecord(null);
  };

  const myRecord =
    clearTimeSeconds !== null
      ? {
          teamName,
          clearTimeSeconds,
          hintCount,
          traitTitle: workshopResult.title,
        }
      : null;

  const leaderboard = [
    ...dummyLeaderboard,
    ...(myRecord ? [myRecord] : []),
  ].sort((a, b) => a.clearTimeSeconds - b.clearTimeSeconds);

  if (!isLoaded) {
    return (
      <main className="page centerPage">
        <p>서찰을 여는 중...</p>
      </main>
    );
  }

  if (screen === "landing") {
    return (
      <main className="page">
        <section className="hero heroVisual">
          <img
            className="heroImage"
            src={heroImg}
            alt="왕, 왕비 후보 A, 왕비 후보 C"
          />
          <div className="heroOverlay" />
          <div className="heroContent">
            <p className="eyebrow">궁중 공방 미스터리 야외 방탈출</p>
            <h1>{gameConfig.title}</h1>
            <p className="heroSubtitle">{gameConfig.subtitle}</p>
            <p className="heroCopy">
              혼례를 앞둔 궁궐.
              <br />
              사라진 물건과 조작된 서찰이 오래된 약속을 흔든다.
            </p>

            <div className="royalStatRow">
              <span className="royalStat">⏳ {gameConfig.playTime}</span>
              <span className="royalStat">👥 {gameConfig.players}</span>
              <span className="royalStat">📍 행궁동 공방거리</span>
            </div>
          </div>
        </section>

        <section className="card">
          <p className="sectionLabel">Investigation Guide</p>
          <h2>조사 안내</h2>
          <ul>
            <li>예상 시간: {gameConfig.playTime}</li>
            <li>권장 인원: {gameConfig.players}</li>
            <li>준비물: {gameConfig.requiredItems.join(", ")}</li>
          </ul>
        </section>

        <section className="card">
          <p className="sectionLabel">Kit Contents</p>
          <h2>봉투 속 단서</h2>
          <ul>
            {gameConfig.kitItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="card">
          <p className="sectionLabel">Clue Preview</p>
          <h2>흔들리는 혼례의 단서</h2>
          <div className="pieceGrid">
            <span className="piece">깨진 도자기</span>
            <span className="piece">끊어진 매듭</span>
            <span className="piece">사라진 팔찌</span>
            <span className="piece">등불 문양</span>
            <span className="piece">가짜 서찰</span>
            <span className="piece locked">닫힌 진실</span>
          </div>
        </section>

        <section className="card warning">
          <p className="sectionLabel">Notice</p>
          <h2>조사관 주의사항</h2>
          <p>길을 건널 때는 스마트폰을 보지 말고 주변을 확인해주세요.</p>
          <p>매장 영업을 방해하지 않도록 외부 단서 중심으로 진행해주세요.</p>
          <p>막히는 구간에서는 힌트를 사용해도 기록은 계속 이어집니다.</p>
        </section>

        <button onClick={() => setScreen("code")}>조사 시작하기</button>
      </main>
    );
  }

  if (screen === "code") {
    return (
      <main className="page">
        <p className="eyebrow">Sealed Letter</p>
        <h1>입장 코드 입력</h1>
        <p>봉인된 서찰을 열기 위해 키트 안쪽의 입장 코드를 입력하세요.</p>

        <input
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="예: ROYAL-001"
        />

        <button onClick={handleCodeSubmit}>서찰 열기</button>

        <button
          className="secondaryButton"
          onClick={() => {
            setMessage("");
            setScreen("landing");
          }}
        >
          메인으로 돌아가기
        </button>

        <p className="smallText">
          테스트 코드는 TEST 또는 ROYAL을 사용할 수 있습니다.
        </p>

        {message && <p className="message">{message}</p>}
      </main>
    );
  }

  if (screen === "team") {
    return (
      <main className="page">
        <p className="eyebrow">Investigator Name</p>
        <h1>조사관 이름</h1>
        <p>혼례의 진실을 밝힐 조사관 이름 또는 팀명을 남겨주세요.</p>

        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="예: 서찰단"
        />

        <button onClick={handleTeamSubmit}>티저 영상 보기</button>

        <button
          className="secondaryButton"
          onClick={() => {
            setMessage("");
            setScreen("code");
          }}
        >
          입장 코드 다시 입력하기
        </button>

        <p className="smallText">
          클리어 인증서와 랭킹에 표시됩니다. 개인정보는 입력하지 않는 것을
          권장합니다.
        </p>

        {message && <p className="message">{message}</p>}
      </main>
    );
  }

  if (screen === "flow") {
    return (
      <main className="page">
        {startTime && (
          <header className="missionHeader">
            <span>
              진행 {flowIndex + 1} / {storyFlow.length}
            </span>
            <span>{formatTime(elapsedSeconds)}</span>
          </header>
        )}

        {currentNode.type === "teaser" && (
          <>
            <p className="eyebrow">Prologue Teaser</p>
            <h1>{currentNode.title}</h1>

            <section className="teaserPanel">
              <video
                className="teaserVideo"
                src={currentNode.videoSrc}
                poster={currentNode.posterSrc}
                controls
                playsInline
              >
                사용 중인 브라우저에서 영상을 재생할 수 없습니다.
              </video>
            </section>

            <section className="card">
              <p className="sectionLabel">Opening</p>
              <h2>{currentNode.subtitle}</h2>
              <p>{currentNode.description}</p>
            </section>

            <button onClick={goNextFlow}>{currentNode.buttonText}</button>

            <button
              className="secondaryButton"
              onClick={() => setScreen("team")}
            >
              조사관 이름 다시 입력하기
            </button>
          </>
        )}

        {currentNode.type === "story" && (
          <>
            <p className="eyebrow">{currentNode.chapter}</p>
            <h1>{currentNode.title}</h1>

            <section className="card storyCard">
              {currentNode.location && (
                <p className="locationText">장소: {currentNode.location}</p>
              )}

              {currentNode.mediaNote && (
                <p className="smallText">{currentNode.mediaNote}</p>
              )}

              {currentNode.paragraphs.map((text, index) => (
                <p key={`${currentNode.id}-paragraph-${index}`}>{text}</p>
              ))}
            </section>

            {currentNode.acquiredItems && (
              <section className="card">
                <p className="sectionLabel">Acquired Items</p>
                <h2>획득한 물품</h2>
                <ul>
                  {currentNode.acquiredItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            <button onClick={goNextFlow}>
              {currentNode.buttonText || "다음 단서로 이동"}
            </button>

            <button
              className="secondaryButton"
              onClick={() => setScreen("progress")}
            >
              단서첩 보기
            </button>
          </>
        )}

        {currentNode.type === "mission" && (
          <>
            <header className="missionHeader">
              <span>
                단서 {currentMissionOrder} / {missionNodes.length}
              </span>
              <span>{formatTime(elapsedSeconds)}</span>
            </header>

            <p className="eyebrow">{currentNode.chapter}</p>
            <h1>{currentNode.title}</h1>

            <section className="card">
              <p className="sectionLabel">Location Guide</p>
              <h2>이동 안내</h2>
              <p>{currentNode.location}</p>
            </section>

            <section className="card">
              <p className="sectionLabel">Case Record</p>
              <h2>사건 기록</h2>
              <p>{currentNode.intro}</p>
            </section>

            <section className="card answerCard">
              <p className="sectionLabel">Investigation Question</p>
              <h2>조사 문제</h2>

              {currentNode.instruction && <p>{currentNode.instruction}</p>}

              {currentNode.contentBlocks ? (
                <div className="missionContentFlow">
                  {currentNode.contentBlocks.map((block, index) => {
                    if (block.type === "text") {
                      return (
                        <p key={`${currentNode.id}-content-${index}`}>
                          {block.text}
                        </p>
                      );
                    }

                    if (block.type === "image") {
                      return (
                        <img
                          key={`${currentNode.id}-content-${index}`}
                          className="missionImage"
                          src={block.src}
                          alt={block.alt || `${currentNode.title} 참고 이미지`}
                        />
                      );
                    }

                    if (block.type === "rule") {
                      return (
                        <div
                          key={`${currentNode.id}-content-${index}`}
                          className="ruleBox"
                        >
                          {block.lines.map((line, lineIndex) => (
                            <p
                              key={`${currentNode.id}-rule-${index}-${lineIndex}`}
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              ) : (
                <>
                  {currentNode.image && (
                    <img
                      className="missionImage"
                      src={currentNode.image}
                      alt={`${currentNode.title} 참고 이미지`}
                    />
                  )}

                  {currentNode.images && (
                    <div className="missionImageList">
                      {currentNode.images.map((imageSrc, index) => (
                        <img
                          key={imageSrc}
                          className="missionImage"
                          src={imageSrc}
                          alt={`${currentNode.title} 참고 이미지 ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {currentNode.rule && (
                    <div className="ruleBox">
                      {currentNode.rule.map((rule, index) => (
                        <p key={`${currentNode.id}-rule-${index}`}>{rule}</p>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div className="answerBox">
                <input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={
                    currentNode.answer?.startsWith("TEMP")
                      ? "임시 퍼즐입니다"
                      : "정답을 입력하세요"
                  }
                />

                <button onClick={submitMissionAnswer}>
                  {currentNode.answer?.startsWith("TEMP")
                    ? "임시로 진행하기"
                    : "단서 확인"}
                </button>
              </div>
            </section>

            <section className="card hintCard">
              <p className="sectionLabel">Hint</p>
              <h2>힌트</h2>

              {currentNode.hints?.map((hint, index) => (
                <div
                  key={`${currentNode.id}-hint-${index}`}
                  className="hintBlock"
                >
                  <button
                    className="secondaryButton"
                    onClick={() => openHint(index)}
                  >
                    힌트 {index + 1} 보기
                  </button>

                  {isHintOpen(index) && <p className="hint">{hint}</p>}
                </div>
              ))}
            </section>

            <button
              className="secondaryButton"
              onClick={() => setScreen("progress")}
            >
              단서첩 보기
            </button>

            {message && <p className="message">{message}</p>}
          </>
        )}

        {currentNode.type === "ending" && (
          <>
            <p className="eyebrow">ENDING</p>
            <h1>{currentNode.title}</h1>

            <section className="card endingCard">
              {currentNode.paragraphs.map((text, index) => (
                <p key={`${currentNode.id}-paragraph-${index}`}>{text}</p>
              ))}
            </section>

            <button onClick={goNextFlow}>
              {currentNode.buttonText || "클리어 인증 보기"}
            </button>

            <button
              className="secondaryButton"
              onClick={() => setScreen("progress")}
            >
              단서첩 보기
            </button>
          </>
        )}
      </main>
    );
  }

  if (screen === "progress") {
    return (
      <main className="page">
        <p className="eyebrow">Clue Note</p>
        <h1>단서첩</h1>

        <section className="card">
          <p className="sectionLabel">Progress</p>
          <p>
            이야기 진행률 {flowIndex + 1} / {storyFlow.length}
          </p>
          <div className="progressBar">
            <div
              className="progressFill"
              style={{
                width: `${((flowIndex + 1) / storyFlow.length) * 100}%`,
              }}
            />
          </div>
        </section>

        <section className="card">
          <p className="sectionLabel">Craft Street Map</p>
          <h2>공방거리 조사 지도</h2>
          <div className="clueMap">
            {missionNodes.map((mission) => {
              const isCleared = pieces.includes(mission.piece);
              const isCurrent = currentNode.id === mission.id;

              return (
                <div
                  key={mission.id}
                  className={`clueMapItem ${
                    isCleared ? "cleared" : isCurrent ? "current" : "locked"
                  }`}
                >
                  <span>{mission.missionId}</span>
                  <div>
                    <strong>{mission.title}</strong>
                    <p>
                      {isCleared
                        ? mission.piece
                        : isCurrent
                          ? "현재 조사 중"
                          : "아직 닫힌 단서"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card">
          <p className="sectionLabel">Collected Clues</p>
          <h2>획득한 단서</h2>
          <div className="pieceGrid">
            {missionNodes.map((mission) => (
              <span
                key={mission.id}
                className={
                  pieces.includes(mission.piece) ? "piece" : "piece locked"
                }
              >
                {pieces.includes(mission.piece) ? mission.piece : "???"}
              </span>
            ))}
          </div>
        </section>

        <button onClick={() => setScreen("flow")}>조사로 돌아가기</button>
      </main>
    );
  }

  if (screen === "clear") {
    const finalClearSeconds = clearTimeSeconds || elapsedSeconds;
    const clearTitle = getClearTitle(finalClearSeconds, hintCount);
    const hintEnding = getHintEnding(hintCount);

    return (
      <main className="page centerPage">
        <p className="eyebrow">Truth Revealed</p>
        <h1>진실 확인</h1>

        <section className="card">
          <p className="sectionLabel">Final Letter</p>
          <h2>왕비 후보의 서찰</h2>
          <p>모든 단서는 왕의 마음이 변했다는 방향으로 A를 흔들고 있었다.</p>
          <p>
            그러나 도자기는 스스로 깨진 것이 아니었고, 매듭은 일부러 끊어졌으며,
            팔찌는 버려진 것이 아니라 숨겨져 있었다.
          </p>
          <p>
            서찰은 조작되었고, 사라진 기록은 누군가 A의 동선을 노리고 있었음을
            보여주었다.
          </p>
          <p>
            <strong>“오래된 약속은 아직 끊어지지 않았다.”</strong>
          </p>
        </section>

        <section className="card certificateCard">
          <p className="eyebrow">CLEAR CERTIFICATE</p>
          <h2>혼례의 진실을 밝힌 조사관</h2>

          <p>조사관: {teamName}</p>
          <p>조사 시간: {formatTime(finalClearSeconds)}</p>
          <p>힌트 사용: {hintCount}회</p>
          <p>획득 칭호: {clearTitle}</p>
          <p>엔딩 평가: {hintEnding}</p>
        </section>

        <section className="card resultCard">
          <p className="eyebrow">RECOMMENDED WORKSHOP</p>
          <h2>{workshopResult.title}</h2>
          <p>추천 공방: {workshopResult.workshop}</p>
          <p>대표 성향: {workshopResult.statName}</p>
          <p>{workshopResult.description}</p>
          <h3>추천 체험</h3>
          <ul>
            {workshopResult.recommendedCrafts.map((craft) => (
              <li key={craft}>{craft}</li>
            ))}
          </ul>
        </section>

        <section className="card">
          <p className="sectionLabel">Reward</p>
          <h2>보상 안내</h2>
          <p>이 화면을 제시하면 클리어 인증과 연계 혜택을 받을 수 있습니다.</p>
        </section>

        <button onClick={() => setScreen("leaderboard")}>
          오늘의 조사 랭킹 보기
        </button>
        <button className="secondaryButton" onClick={resetGame}>
          처음부터 다시 하기
        </button>
      </main>
    );
  }

  if (screen === "leaderboard") {
    return (
      <main className="page">
        <p className="eyebrow">Today Ranking</p>
        <h1>오늘의 조사관 랭킹</h1>
        <p className="smallText">
          매일 00:00 기준으로 새로운 랭킹이 시작됩니다.
        </p>

        <section className="card rankingCard">
          <p className="sectionLabel">Ranking Board</p>
          <h2>오늘의 기록</h2>

          <div className="rankingList">
            {leaderboard.map((record, index) => (
              <button
                key={`${record.teamName}-${index}`}
                className="rankingItem"
                onClick={() => setSelectedRecord(record)}
              >
                <span className="rankingPlace">{index + 1}</span>

                <div className="rankingInfo">
                  <strong>{record.teamName}</strong>
                  <span>{record.traitTitle || "조사관형"}</span>
                </div>

                <span className="rankingTime">
                  {formatTime(record.clearTimeSeconds)}
                </span>
              </button>
            ))}
          </div>
        </section>

        {selectedRecord && (
          <section className="card resultCard">
            <p className="eyebrow">INVESTIGATOR CARD</p>
            <h2>{selectedRecord.teamName}</h2>

            <p>조사 시간: {formatTime(selectedRecord.clearTimeSeconds)}</p>
            <p>힌트 사용: {selectedRecord.hintCount}회</p>
            <p>조사 성향: {selectedRecord.traitTitle || "조사관형"}</p>

            <button
              className="secondaryButton"
              onClick={() => setSelectedRecord(null)}
            >
              닫기
            </button>
          </section>
        )}

        <button onClick={() => setScreen("clear")}>클리어 화면으로</button>
      </main>
    );
  }

  return null;
}

export default App;
