import { useEffect, useMemo, useRef, useState } from "react";
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
  playTime: gameInfo?.playTime || "30~40분",
  players: gameInfo?.players || "1~4명",
  requiredItems: gameInfo?.requiredItems || ["스마트폰", "사건 키트", "필기구"],
  kitItems: gameInfo?.kitItems || [
    "왕비 후보의 서찰",
    "증좌 그림",
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
      "궁 안팎은 유례없이 분주했다. 곳곳에서는 혼례 준비가 한창이었고, 기록관인 당신 역시 쏟아지는 문건과 보고문에 파묻혀 정신없는 나날을 보내고 있었다.",
      "이현 전하와 유력한 왕비 후보 연이의 혼례는 이미 기정사실로 여겨지고 있었기에, 모두가 다가올 경사를 기대하고 있었다.",
      "그날도 평소와 다름없이 혼례 관련 기록을 정리하던 당신은 책상 위에 놓인 낯선 봉서 하나를 발견했다.",
      "분명 조금 전까지 없었던 것이었다.",
      "봉서에는 보낸 이의 이름도, 관인도 찍혀 있지 않았다. 다만 정갈한 필적으로 짧게 적힌 문구만이 눈에 들어왔다.",
      "「부디 이 글을 읽어주시옵소서.」",
      "이상한 기분에 사로잡힌 당신은 조심스럽게 봉인을 뜯었다.",
      "안에는 서찰 한 장이 들어 있었다.",
      "서찰에는 자신이 억울한 누명을 쓰고 있으며, 혼례를 앞두고 전하와의 추억이 담긴 물건들이 하나둘 사라지거나 훼손되고 있다는 내용이 적혀 있었다.",
      "잠시 서찰을 내려다보던 당신은 함께 동봉된 물건들을 확인했다.",
      "낡은 증좌 그림 여러 장. 그리고 훼손된 물건들의 기록.",
      "깨져버린 도자기. 끊어진 매듭. 사라진 팔찌. 찢겨진 연서. 버려진 초상화.",
      "언뜻 보기에는 서로 아무 관련도 없어 보이는 물건들이었다.",
      "그러나 이상하게도 모든 물건에는 누군가의 소중한 추억이 깃들어 있는 듯했다.",
      "혼례를 앞둔 궁중. 정체를 숨긴 한 소녀의 도움 요청. 그리고 의미를 알 수 없는 증좌들.",
      "당신은 직감했다.",
      "이것은 단순한 장난도, 우연한 파손 사건도 아니다.",
      "어딘가에 숨겨진 진실이 있다.",
      "그리고 그 진실은 지금, 당신의 손에 맡겨졌다.",
    ],
    acquiredItems: [
      "왕비 후보의 서찰",
      "낡은 증좌 그림",
      "훼손된 물건들의 기록",
      "조사 지도",
    ],
    buttonText: "다음으로",
  },
  {
    id: "mission-1",
    type: "mission",
    missionId: 1,
    chapter: "미션 1",
    title: "깨진 향로",
    location: "향기도예",
    piece: "깨진 향 도자기 조각",
    puzzleType: "tile-swap",

    arTargetImage: "/mission/mission1-pottery/hyanggi-sign.png",
    arMatchThreshold: 0.55,
    arMaxFailCount: 3,

    puzzlePieces: [
      {
        id: "piece-01",
        image: "/mission/mission1-pottery/piece-01.png",
        correctIndex: 0,
        alt: "깨진 향 도자기 조각 1",
      },
      {
        id: "piece-02",
        image: "/mission/mission1-pottery/piece-02.png",
        correctIndex: 1,
        alt: "깨진 향 도자기 조각 2",
      },
      {
        id: "piece-03",
        image: "/mission/mission1-pottery/piece-03.png",
        correctIndex: 2,
        alt: "깨진 향 도자기 조각 3",
      },
      {
        id: "piece-04",
        image: "/mission/mission1-pottery/piece-04.png",
        correctIndex: 3,
        alt: "깨진 향 도자기 조각 4",
      },
      {
        id: "piece-05",
        image: "/mission/mission1-pottery/piece-05.png",
        correctIndex: 4,
        alt: "깨진 향 도자기 조각 5",
      },
      {
        id: "piece-06",
        image: "/mission/mission1-pottery/piece-06.png",
        correctIndex: 5,
        alt: "깨진 향 도자기 조각 6",
      },
      {
        id: "piece-07",
        image: "/mission/mission1-pottery/piece-07.png",
        correctIndex: 6,
        alt: "깨진 향 도자기 조각 7",
      },
      {
        id: "piece-08",
        image: "/mission/mission1-pottery/piece-08.png",
        correctIndex: 7,
        alt: "깨진 향 도자기 조각 8",
      },
      {
        id: "piece-09",
        image: "/mission/mission1-pottery/piece-09.png",
        correctIndex: 8,
        alt: "깨진 향 도자기 조각 9",
      },
    ],
    initialOrder: [
      "piece-05",
      "piece-01",
      "piece-09",
      "piece-03",
      "piece-08",
      "piece-02",
      "piece-06",
      "piece-04",
      "piece-07",
    ],
    letterTitle: "플레이어가 받은 서찰",
    letterParagraphs: [
      "첫 번째 흔적은 향을 담던 도자기입니다.",
      "오래전 전하와 제가 함께 고른 물건이지요.",
      "하지만 누군가 그것을 깨뜨렸습니다.",
      "모두들 불길한 징조라 말하지만… 저는 믿지 않습니다.",
      "흙은 손길을 기억합니다.",
      "부서진 그릇의 흔적을 따라 향기도예로 가 주세요.",
    ],
    recordTitle: "사건 기록 제1장 — 깨진 향로",
    recordParagraphs: [
      "간택을 앞둔 날 밤, 왕비 후보 A가 보관하던 향 도자기가 깨진 채 발견되었다.",
      "궁 안에서는 이것이 혼례를 앞둔 불길한 징조라 수군거렸고, 일부는 A가 스스로 깨뜨렸다고 주장했다.",
      "그러나 기록관인 당신은 이상함을 느낀다.",
      "깨진 조각들은 모두 보관되어 있다.",
      "이것이 사고인지, 누군가의 의도인지 밝혀내라.",
    ],
    instruction:
      "흩어진 조각을 원래 모습으로 되돌려라. 향 도자기의 본래 형상을 복원하면 숨겨진 진실이 드러날 것이다.",
    afterPuzzleTitle: "간판 AR 조사",
    afterPuzzleText:
      "복원된 향 도자기를 살펴본 뒤, 가게 간판을 AR로 확인하라. 금의 결이 어느 방향으로 퍼져나가는지 확인해야 한다.",
    choiceQuestion: {
      title: "조사 문제",
      description:
        "복원된 향 도자기를 살펴보니 금의 결이 모두 한 곳에서 퍼져나가고 있다. 이것은 무엇을 의미하는가?",
      choices: [
        {
          value: "1",
          label: "① 실수로 떨어뜨려 깨졌다",
        },
        {
          value: "2",
          label: "② 오래되어 자연히 갈라졌다",
        },
        {
          value: "3",
          label: "③ 누군가 한 지점을 강하게 내리쳐 깨뜨렸다",
        },
      ],
    },
    hints: [
      "먼저 도자기 조각의 문양이 이어지도록 맞춰라.",
      "금의 결은 단순한 장식이 아니라 충격이 퍼진 방향을 보여준다.",
      "한 곳에서 금이 퍼져나간다면, 충격이 시작된 지점이 있었다는 뜻이다.",
    ],
    answer: "3",
    acceptedAnswers: [
      "3",
      "③",
      "누군가한지점을강하게내리쳐깨뜨렸다",
      "누군가한지점을강하게내리쳐깨뜨림",
    ],
  },
  {
    id: "story-2",
    type: "story",
    chapter: "두 번째 기록",
    title: "시작일 뿐입니다",
    paragraphs: [
      "당신은 가장 먼저 증좌 그림 속 깨진 도자기를 조사하기로 했다.",
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
      "당신은 다시 책상 위에 펼쳐진 증좌 그림들을 바라보았다.",
      "처음에는 서로 관련 없는 물건이라 생각했다. 하지만 이제는 달랐다.",
      "이 모든 물건들이 하나의 사건으로 연결되어 있다는 불길한 예감이 들었다.",
      "정체를 숨긴 소녀는 왜 당신에게 도움을 요청한 것일까.",
      "그리고 누가, 무슨 이유로 이런 일들을 벌이고 있는 것일까.",
      "당신은 무심코 창밖을 바라보았다.",
      "며칠 뒤면 궁중의 혼례가 열린다.",
      "그러나 어쩐지, 그 혼례가 무사히 치러지지 않을 것만 같은 불길한 기분이 가슴 한켠에 자리 잡기 시작했다.",
    ],
    buttonText: "다음 실마리로 이동",
  },
  {
    id: "mission-2",
    type: "mission",
    missionId: 2,
    chapter: "미션 2",
    title: "끊어진 매듭",
    location: "나정희 규방공예",
    piece: "복원된 약속 매듭",
    puzzleType: "stitch-connect",

    stitchImage: "/mission/mission2-stitch/stitch-base.png",

    stitchPoints: [
      { id: "L1", side: "left", x: 38.5, y: 29 },
      { id: "L2", side: "left", x: 36.8, y: 35 },
      { id: "L3", side: "left", x: 31.5, y: 39 },
      { id: "L4", side: "left", x: 28, y: 43 },
      { id: "L5", side: "left", x: 25, y: 47 },
      { id: "L6", side: "left", x: 19.2, y: 52 },

      { id: "R1", side: "right", x: 47.8, y: 29 },
      { id: "R2", side: "right", x: 49.7, y: 36 },
      { id: "R3", side: "right", x: 48.2, y: 43 },
      { id: "R4", side: "right", x: 41, y: 50 },
      { id: "R5", side: "right", x: 38, y: 57 },
      { id: "R6", side: "right", x: 36, y: 64 },
    ],

    stitchPairs: [
      ["L1", "R1"],
      ["L2", "R2"],
      ["L3", "R3"],
      ["L4", "R4"],
      ["L5", "R5"],
      ["L6", "R6"],
    ],

    intro:
      "두 번째 실마리는 끊어진 약속 매듭이다. 전하와 연이가 어린 시절 주고받았던 매듭 장식은 혼인을 약속하는 상징이었지만, 지금은 찢기고 끊어진 채 남아 있었다.",
    instruction:
      "찢어진 자락 양옆에 남은 바느질 자리를 확인하고, 서로 맞닿아야 할 구멍을 이어 매듭을 복원하라.",
    rule: [
      "왼쪽과 오른쪽의 구멍을 한 쌍씩 이어라.",
      "같은 쪽 구멍끼리는 이을 수 없다.",
      "모든 실이 제자리를 찾으면 끊어진 약속의 의미가 다시 드러난다.",
    ],
    solvedTitle: "복원 완료",
    solvedText:
      "찢어진 자락이 다시 이어지자, 매듭 안쪽에 숨겨져 있던 글귀가 드러났다. 『전하의 마음은 어찌 늘 그대에게만 머무는지요.』",
    hints: [
      "찢어진 틈의 양옆을 살펴라. 실이 지나가야 할 구멍들이 남아 있다.",
      "가장 가까운 맞은편 구멍끼리 차례대로 이어보라.",
      "위에서 아래로 한 쌍씩 이어가면 매듭의 형태가 안정적으로 복원된다.",
    ],
    answer: "STITCH_SOLVED",
    acceptedAnswers: ["STITCH_SOLVED"],
  },
  {
    id: "story-3",
    type: "story",
    chapter: "세 번째 기록",
    title: "그대라는 호칭",
    paragraphs: [
      "도자기 사건을 조사하던 당신은 다음 실마리를 따라 끊어진 매듭의 기록을 살펴보았다.",
      "기록에 따르면 이 매듭은 이현 전하가 어린 시절부터 소중히 간직해 온 물건이었다.",
      "평범한 장식품이 아니라, 특정한 사람과의 약속을 상징하는 물건이었다고 한다.",
      "그런 물건이 누군가에 의해 날카롭게 끊어져 있었다.",
      "실수로 풀어진 흔적은 아니었다.",
      "누군가 의도적으로 잘라낸 것이 분명했다.",
      "당신은 증좌 그림을 유심히 살펴보다 매듭을 보관하던 함의 안쪽에서 작은 종이 조각 하나를 발견했다.",
      "바랜 종이 위에는 짧은 문장이 적혀 있었다.",
      "『전하의 마음은 어찌 늘 그대에게만 머무는지요.』",
      "순간 당신의 손이 멈췄다.",
      "단순한 원망. 혹은 질투. 그런 감정이 묻어나는 문장이었다.",
      "하지만 이상한 점은 따로 있었다.",
      "‘그대’라는 호칭이었다.",
      "궁중 기록을 다루는 당신은 알고 있었다.",
      "궁 안에서 연이를 향해 ‘그대’라는 표현을 사용하는 사람은 거의 없었다.",
      "그 호칭은 지나치게 사적인 표현이었다.",
      "그리고 당신이 알기로, 평소 연이를 향해 그런 말을 사용하던 사람은 단 한 명뿐이었다.",
      "왕비 후보 서화.",
      "연이와 함께 간택전에 참여하고 있는 또 다른 후보.",
      "물론 이것만으로 그녀를 흉수라 단정할 수는 없었다.",
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
      "전하가 연이에게 전하려 했던 팔찌는 간택 직전 사라졌다. 다시 발견된 팔찌 조각은 검게 그을려 있었지만, 주변에는 아직 팔찌의 원래 배열을 알려주는 흔적이 남아 있었다.",
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
      "“며칠 전 밤이었습니다. 우연히 후원을 지나던 중, 서화 규수를 따라온 몸종이 무언가를 품에 숨긴 채 급히 지나가는 모습을 보았습니다.”",
      "“당시에는 대수롭지 않게 여겼으나... 지금 생각해보면 팔찌였을지도 모르겠습니다.”",
      "그 말을 들은 순간, 지금까지 모아온 실마리들이 머릿속에서 하나로 이어지기 시작했다.",
      "게다가 매듭 사건 당시 발견된 쪽지의 필적과 표현 역시 서화를 자연스럽게 떠올리게 만들었다.",
      "물론 확실한 증좌는 없었다.",
      "그러나 지금까지 드러난 정황만 놓고 본다면 가장 유력한 인물은 분명 서화였다.",
      "당신은 서둘러 사건 기록을 정리한 뒤, 평소 누구보다 신뢰하던 사헌부 감찰 청휘를 찾아갔다.",
      "청휘는 당신이 처음 감찰 업무를 맡았을 때부터 곁에서 가르침을 주었던 인물이었다.",
      "누구보다 깐깐했고, 작은 모순 하나도 절대 그냥 넘어가지 않는 사람.",
      "그래서 궁 안에서는 그를 두고 ‘한 번 물면 놓지 않는 사냥개’라 부르곤 했다.",
      "당신은 지금까지 수집한 증좌와 증언들을 모두 설명했다.",
      "“청휘 나리, 흉수를 찾은 것 같습니다.”",
      "잠시 침묵이 흘렀다.",
      "청휘는 기록을 천천히 훑어보더니 뜻밖에도 작게 웃음을 터뜨렸다.",
      "“그래. 수고했군.”",
      "당신은 순간 당황했다.",
      "칭찬에 인색하기로 유명한 청휘가 이렇게 쉽게 인정하는 모습은 처음이었기 때문이다.",
      "“그렇다면... 서화를 조사해야 하지 않겠습니까?”",
      "당신의 질문에 청휘는 고개를 저었다.",
      "“충분하네.”",
      "“예?”",
      "“이미 흉수가 드러났지 않은가. 혼례도 얼마 남지 않았는데 더 이상 일을 키울 필요는 없네.”",
      "그 말은 어딘가 이상했다.",
      "평소의 청휘였다면 증언 하나만으로 사건을 종결하지 않았을 것이다.",
      "오히려 몸종을 불러 심문하고, 그날 밤의 행적을 캐묻고, 며칠 밤을 새워서라도 진실을 확인하려 했을 사람이다.",
      "하지만 오늘의 청휘는 달랐다.",
      "마치 이미 결론을 정해놓은 사람처럼.",
      "마치 사건이 더 깊어지는 것을 원하지 않는 사람처럼.",
      "“남은 일은 윗분들께 맡기게. 자네는 이 정도면 충분히 제 몫을 했네.”",
      "청휘는 기록철을 덮으며 대화를 끝내려 했다.",
      "당신은 고개를 끄덕였지만, 왠지 모를 위화감이 가슴 한구석에 남았다.",
      "분명 지금까지의 실마리는 모두 서화를 가리키고 있었다.",
      "그런데 어째서일까.",
      "사건을 종결하려는 청휘의 모습이, 처음으로 낯설게 느껴졌다.",
    ],
    buttonText: "길 위의 실마리 확인",
  },
  {
    id: "mission-4",
    type: "mission",
    missionId: 4,
    chapter: "길거리 실마리",
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
    title: "질투와 죄 사이",
    paragraphs: [
      "당신은 지금까지의 조사 결과를 정리하며 사건을 마무리할 준비를 하고 있었다.",
      "모든 정황은 서화를 가리키고 있었다.",
      "깨진 도자기, 끊어진 매듭, 사라진 팔찌, 그리고 그녀의 몸종을 목격했다는 궁녀의 증언까지.",
      "비록 결정적인 증좌는 없었지만, 적어도 누군가를 의심해야 한다면 가장 먼저 이름이 오를 사람은 서화였다.",
      "사건 기록을 정리하던 당신은 마지막으로 연이와 관련된 문건들을 확인하기 위해 조사실 기록 보관함을 열었다.",
      "혹시 놓친 부분이 없는지 확인하기 위해서였다.",
      "그러나 기록철을 펼친 순간, 이상한 점을 발견했다.",
      "연이의 처소 도면이 사라져 있었다.",
      "처음에는 단순한 착오라 생각했다.",
      "하지만 일과 기록을 찾으려 했을 때도 마찬가지였다.",
      "며칠 전까지 분명 보관되어 있던 일과 기록 일부가 통째로 없어져 있었다.",
      "몸종 명부 또한 누락된 부분이 눈에 띄었다.",
      "당신은 서둘러 다른 보관함까지 확인했지만 결과는 같았다.",
      "누군가가 특정 기록들만 골라 가져간 것이 분명했다.",
      "잠시 기록철을 내려놓은 당신은 생각에 잠겼다.",
      "서화가 흉수라고 가정하면 모든 사건이 설명될 것 같았다.",
      "질투심 때문에 도자기를 깨뜨리고, 매듭을 끊고, 팔찌를 숨겼다.",
      "충분히 가능한 이야기였다.",
      "하지만 처소 도면은?",
      "일과 기록은?",
      "몸종 명부는?",
      "그것들은 추억의 물건도 아니었고, 연인을 향한 질투와도 관계가 없는 것들이었다.",
      "오히려 누군가의 생활을 감시하고 추적하기 위해 필요한 문건들에 가까웠다.",
      "당신은 무심코 사라진 기록들의 목록을 다시 훑어보았다.",
      "그리고 문득 등골이 서늘해졌다.",
      "질투 때문에 물건을 망가뜨리는 것과 사람의 행적을 조사하는 것은 전혀 다른 문제였다.",
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
      "당신은 처음으로, 누군가가 익명의 보낸 이 자체를 노리고 있을지도 모른다는 불길한 예감을 느끼기 시작했다.",
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
    piece: "가짜 서찰의 꽃 실마리",
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
        text: "색마다 대응되는 단어를 조합해 실마리를 완성하라.",
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
    title: "흔들리는 확신",
    paragraphs: [
      "연이의 기록 일부가 사라진 사실을 확인한 당신은 사건을 처음부터 다시 정리하기 시작했다.",
      "깨진 도자기.",
      "끊어진 매듭.",
      "사라진 팔찌.",
      "모든 증좌는 여전히 왕비 후보 서화를 가리키고 있었다.",
      "그러나 이상한 점이 있었다.",
      "지금까지 서화가 저지른 일들은 모두 비슷했다.",
      "추억이 담긴 물건을 망가뜨리고, 연서를 훼손하고, 두 사람의 사이를 멀어지게 만드는 것.",
      "질투에 사로잡힌 사람이 저지를 법한 행동들이었다.",
      "하지만 최근 사라진 것은 물건이 아니었다.",
      "연이의 일과 기록.",
      "처소 도면.",
      "몸종들의 근무 기록.",
      "누군가가 연이의 일상을 조사하고 있었다.",
      "당신은 쉽게 설명할 수 없는 불안감을 느꼈다.",
      "그날 밤, 사건에 대한 생각을 정리하기 위해 궁 안뜰을 걷던 당신은 우연히 서화를 마주쳤다.",
      "달빛이 희미하게 내려앉은 정자 아래, 그녀는 홀로 앉아 있었다.",
      "평소의 당당한 모습과 달리 어딘가 지쳐 보였다.",
      "잠시 망설이던 당신은 조심스럽게 입을 열었다.",
      "“연이를 미워하십니까?”",
      "서화는 고개를 들었다.",
      "잠시 침묵이 흘렀다.",
      "“…예.”",
      "담담한 대답이었다.",
      "“어째서입니까?”",
      "그녀는 잠시 시선을 내리깔았다.",
      "“그 아이는 늘 모든 것을 가지고 있었으니까요.”",
      "질투와 체념이 뒤섞인 목소리였다.",
      "그러나 곧 그녀는 작게 웃음을 흘렸다.",
      "“하지만…”",
      "잠시 말을 고르던 그녀가 천천히 말했다.",
      "“그 아이가 다치기를 바란 적은 없습니다.”",
      "당신은 아무 말도 할 수 없었다.",
      "그녀의 표정에는 거짓을 숨기는 사람의 초조함이 없었다.",
      "오히려 오랫동안 가슴속에 품어온 질투를 처음으로 인정하는 사람의 씁쓸함이 담겨 있었다.",
      "서화는 자리에서 일어나 먼 하늘을 바라보았다.",
      "“이제 곧 혼례가 열리겠지요.”",
      "그녀는 작게 미소를 지었다.",
      "“전하께서는 끝내 저를 보지 않으셨습니다.”",
      "그 말을 남긴 채 그녀는 어둠 속으로 걸어갔다.",
      "당신은 한동안 그 뒷모습을 바라보았다.",
      "서화는 분명 잘못을 저질렀다.",
      "도자기를 깨뜨리고,",
      "매듭을 끊고,",
      "팔찌를 숨겼다.",
      "하지만…",
      "정말 이 사람이 연이를 해하려 했을까?",
      "처음으로 당신의 확신이 흔들리기 시작했다.",
    ],
    buttonText: "다음 실마리로 이동",
  },
  {
    id: "mission-6",
    type: "mission",
    missionId: 6,
    chapter: "길거리 실마리",
    title: "두 해 사이의 짐승",
    location: "길거리 연꽃 벽화",
    piece: "연꽃 벽의 동물 실마리",
    image: "/mission/mission6-lotus-crop.png",
    intro:
      "종이노리에서 얻은 문장, “하나의 날 두 이름”은 다음 벽을 찾는 실마리였다.",
    instruction:
      "연꽃이 크게 피어난 곳을 찾아라. 그 꽃의 양옆 아래에는 해를 바라보는 두 꽃이 놓여 있으니, 진실은 그 사이에 숨어 있다.",
    rule: [
      "글로 남겨진 말들은 잠시 잊고, 그림 속 생명들의 모습만을 살피라.",
      "연꽃의 왼쪽과 오른쪽 아래에 놓인 두 해바라기 사이를 확인하라.",
      "그 사이에 놓인 그림들 가운데 같은 짐승이 두 번 모습을 드러낼 것이다.",
      "그 짐승의 이름이 곧 그대가 찾는 답이다.",
    ],
    hints: [
      "연꽃 그림 자체가 정답은 아니다. 연꽃은 벽을 찾기 위한 기준점이다.",
      "‘해를 바라보는 두 꽃’은 해바라기를 뜻한다.",
      "글씨가 적힌 작은 조각은 제외하고, 그림만 보아라.",
      "같은 짐승이 두 번 등장한다. 붉은 벼슬이 실마리다.",
    ],
    answer: "닭",
    acceptedAnswers: ["닭", "수탉", "닭그림", "수탉그림"],
  },
  {
    id: "story-7",
    type: "story",
    chapter: "일곱 번째 기록",
    title: "오라버니",
    video: "/story7.mp4",
    videoPoster: "/story7-poster.png",
    paragraphs: [
      "서화가 청휘를 향해 떨리는 목소리로 말했다.",
      "“오라버니... 이제 그만하십시오.”",
      "그 한마디로, 지금까지의 모든 실마리가 뒤집히기 시작했다.",
    ],
    buttonText: "마지막 어찰 확인",
  },
  {
    id: "mission-7",
    type: "mission",
    missionId: 7,
    chapter: "마지막 길거리 실마리",
    title: "비밀의 통로를 찾아라",
    location: "길거리 비밀 통로",
    piece: "비밀 통로의 영물",
    intro:
      "청휘의 음모를 밝히기 위해서는 마지막 암호가 필요하다. 지금까지 모은 실마리들은 하나의 길을 가리키고 있었다.",
    instruction:
      "다음 문구가 가리키는 장소를 찾아라. 그곳을 지키는 영물의 이름을 입력하면 마지막 어찰이 열린다.",
    rule: [
      "「붉은 벽돌이 하늘을 가리고, 하얀 울타리가 호위하는 좁은 길.",
      "머리 위로 작은 별들이 줄지어 밤을 기다리네.",
      "은빛 물고기가 허공을 헤엄치고, 그 끝에는 붉은 아치문이 너를 기다리리라.」",
      "단 한 번의 숨결로 불리고, 가장 긴 몸으로 골목을 수호하는 영물은 무엇인가?",
    ],
    hints: [
      "문구는 장소의 생김새를 묘사한다. 붉은 벽돌, 하얀 울타리, 별 장식, 은빛 물고기, 붉은 아치문을 찾아라.",
      "정답은 동물이 아니라, 길을 수호하는 상징적 영물이다.",
      "한 글자로 불리는 긴 몸의 영물을 떠올려라.",
    ],
    answer: "용",
    acceptedAnswers: ["용", "룡"],
  },
  {
    id: "ending",
    type: "ending",
    title: "혼례의 진실",
    paragraphs: [
      "마지막 암호가 해독되는 순간, 흩어져 있던 실마리들은 하나의 진실로 이어졌다.",
      "깨진 도자기.",
      "끊어진 매듭.",
      "사라진 팔찌.",
      "찢겨진 연서.",
      "그리고 사라진 기록들.",
      "지금까지의 모든 사건 뒤에는 사헌부 감찰 청휘의 음모가 숨어 있었다.",
      "청휘는 자신의 혈육인 서화를 왕비의 자리에 앉히고, 그 권세를 이용해 궁중의 실권을 손에 넣으려 했다.",
      "서화의 질투심을 부추기고 이용하며 사건을 꾸몄고, 마침내 연이를 해하려는 계책까지 세웠다.",
      "모든 진실이 밝혀지자 이현은 큰 충격에 빠졌다.",
      "그동안 자신이 들었던 소문들.",
      "연이를 의심하게 만들었던 수많은 이야기들.",
      "그리고 두 사람의 사이를 갈라놓았던 사건들.",
      "그 모든 것이 누군가의 손에 의해 날조된 것이었다.",
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
      "궁중에서는 마침내 혼례가 열렸다.",
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
  return String(value || "")
    .trim()
    .replace(/\s/g, "")
    .toLowerCase();
}

function getCouponExpireDateText() {
  const today = new Date();

  const targetYear = today.getFullYear();
  const targetMonth = today.getMonth() + 1;

  const lastDayOfTargetMonth = new Date(
    targetYear,
    targetMonth + 1,
    0,
  ).getDate();

  const expireDate = new Date(
    targetYear,
    targetMonth,
    Math.min(today.getDate(), lastDayOfTargetMonth),
  );

  return `${expireDate.getFullYear()}년 ${
    expireDate.getMonth() + 1
  }월 ${expireDate.getDate()}일`;
}

function sanitizeScreen(screen) {
  const allowedScreens = [
    "poster",
    "landing",
    "code",
    "team",
    "flow",
    "progress",
    "clear",
    "coupon",
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

function makeInitialTileOrder(correctOrder, initialOrder) {
  if (initialOrder?.length === correctOrder.length) {
    return initialOrder;
  }

  const shuffled = [...correctOrder];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  if (shuffled.every((id, index) => id === correctOrder[index])) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }

  return shuffled;
}

function TileSwapPuzzle({ pieces, initialOrder, onSolved }) {
  const correctOrder = useMemo(
    () =>
      [...pieces]
        .sort((a, b) => a.correctIndex - b.correctIndex)
        .map((piece) => piece.id),
    [pieces],
  );

  const pieceMap = useMemo(() => {
    return pieces.reduce((acc, piece) => {
      acc[piece.id] = piece;
      return acc;
    }, {});
  }, [pieces]);

  const [order, setOrder] = useState(() =>
    makeInitialTileOrder(correctOrder, initialOrder),
  );
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isSolved, setIsSolved] = useState(false);

  const handleTileClick = (index) => {
    if (isSolved) return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
      return;
    }

    if (selectedIndex === index) {
      setSelectedIndex(null);
      return;
    }

    const nextOrder = [...order];
    [nextOrder[selectedIndex], nextOrder[index]] = [
      nextOrder[index],
      nextOrder[selectedIndex],
    ];

    setOrder(nextOrder);
    setSelectedIndex(null);

    const solved = nextOrder.every(
      (id, tileIndex) => id === correctOrder[tileIndex],
    );

    if (solved) {
      setIsSolved(true);
      onSolved?.();
    }
  };

  return (
    <div className="tilePuzzleWrap">
      <div className="tilePuzzleGrid">
        {order.map((pieceId, index) => {
          const piece = pieceMap[pieceId];

          return (
            <button
              key={`${pieceId}-${index}`}
              type="button"
              className={`tilePuzzlePiece ${
                selectedIndex === index ? "selected" : ""
              } ${isSolved ? "solved" : ""}`}
              onClick={() => handleTileClick(index)}
            >
              <img src={piece.image} alt={piece.alt || piece.id} />
            </button>
          );
        })}
      </div>

      <p className="smallText">
        조각 하나를 누른 뒤, 다른 조각을 누르면 두 조각의 위치가 바뀝니다.
      </p>

      {isSolved && (
        <p className="message successMessage">
          향 도자기의 본래 형상이 복원되었습니다.
        </p>
      )}
    </div>
  );
}

function getStitchPairKey(a, b) {
  return [a, b].sort().join("__");
}

function StitchConnectPuzzle({ image, points, correctPairs, onSolved }) {
  const pointMap = useMemo(() => {
    return points.reduce((acc, point) => {
      acc[point.id] = point;
      return acc;
    }, {});
  }, [points]);

  const correctPairKeys = useMemo(() => {
    return new Set(correctPairs.map(([a, b]) => getStitchPairKey(a, b)));
  }, [correctPairs]);

  const [selectedPointId, setSelectedPointId] = useState(null);
  const [connections, setConnections] = useState([]);
  const [wrongPairKey, setWrongPairKey] = useState("");
  const [notice, setNotice] = useState("");
  const [isSolved, setIsSolved] = useState(false);

  const connectedPointIds = useMemo(() => {
    const ids = new Set();

    connections.forEach(([a, b]) => {
      ids.add(a);
      ids.add(b);
    });

    return ids;
  }, [connections]);

  const handlePointClick = (pointId) => {
    if (isSolved) return;
    if (connectedPointIds.has(pointId)) {
      setNotice("이미 실이 지나간 자리입니다.");
      return;
    }

    if (!selectedPointId) {
      setSelectedPointId(pointId);
      setNotice("반대편 구멍을 선택하세요.");
      return;
    }

    if (selectedPointId === pointId) {
      setSelectedPointId(null);
      setNotice("");
      return;
    }

    const fromPoint = pointMap[selectedPointId];
    const toPoint = pointMap[pointId];

    if (!fromPoint || !toPoint) return;

    if (fromPoint.side === toPoint.side) {
      setWrongPairKey(getStitchPairKey(selectedPointId, pointId));
      setNotice("같은 쪽 구멍끼리는 이을 수 없습니다.");
      setSelectedPointId(null);

      setTimeout(() => {
        setWrongPairKey("");
      }, 450);

      return;
    }

    const pairKey = getStitchPairKey(selectedPointId, pointId);

    if (!correctPairKeys.has(pairKey)) {
      setWrongPairKey(pairKey);
      setNotice(
        "실의 방향이 어긋났습니다. 찢어진 자락의 맞은편 구멍을 다시 살피세요.",
      );
      setSelectedPointId(null);

      setTimeout(() => {
        setWrongPairKey("");
      }, 450);

      return;
    }

    const nextConnections = [...connections, [selectedPointId, pointId]];
    setConnections(nextConnections);
    setSelectedPointId(null);
    setNotice("");

    if (nextConnections.length === correctPairs.length) {
      setIsSolved(true);
      setNotice("끊어진 매듭이 다시 이어졌습니다.");
      onSolved?.();
    }
  };

  return (
    <div className="stitchPuzzleWrap">
      <div className="stitchCanvas">
        <img
          className="stitchBaseImage"
          src={image}
          alt="찢어진 매듭 복원 퍼즐"
        />

        <svg
          className="stitchSvg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {connections.map(([fromId, toId]) => {
            const from = pointMap[fromId];
            const to = pointMap[toId];

            return (
              <line
                key={`${fromId}-${toId}`}
                className="stitchLine"
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
              />
            );
          })}

          {wrongPairKey &&
            (() => {
              const [a, b] = wrongPairKey.split("__");
              const from = pointMap[a];
              const to = pointMap[b];

              if (!from || !to) return null;

              return (
                <line
                  className="stitchLine wrong"
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                />
              );
            })()}
        </svg>

        {points.map((point) => {
          const isSelected = selectedPointId === point.id;
          const isConnected = connectedPointIds.has(point.id);

          return (
            <button
              key={point.id}
              type="button"
              className={`stitchPoint ${point.side} ${
                isSelected ? "selected" : ""
              } ${isConnected ? "connected" : ""}`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
              }}
              onClick={() => handlePointClick(point.id)}
              aria-label={`${point.id} 바느질 구멍`}
            />
          );
        })}
      </div>

      <p className="smallText">
        한쪽 구멍을 누른 뒤, 반대편 구멍을 눌러 찢어진 자락을 이어주세요.
      </p>

      {notice && (
        <p className={`message ${isSolved ? "successMessage" : ""}`}>
          {notice}
        </p>
      )}
    </div>
  );
}

function StoryVideo({ src, poster }) {
  const videoRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);

    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  return (
    <div className="storyVideoWrap">
      <video
        ref={videoRef}
        className="storyVideo"
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
      >
        이 브라우저에서는 영상을 재생할 수 없습니다.
      </video>

      <div className="videoSpeedControls" aria-label="영상 재생 속도">
        {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
          <button
            key={rate}
            type="button"
            className={`videoSpeedButton ${
              playbackRate === rate ? "active" : ""
            }`}
            onClick={() => changePlaybackRate(rate)}
          >
            {rate}x
          </button>
        ))}
      </div>
    </div>
  );
}

function drawVideoCover(video, ctx, canvasWidth, canvasHeight) {
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  const canvasRatio = canvasWidth / canvasHeight;
  const videoRatio = videoWidth / videoHeight;

  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = videoWidth;
  let sourceHeight = videoHeight;

  if (videoRatio > canvasRatio) {
    sourceWidth = videoHeight * canvasRatio;
    sourceX = (videoWidth - sourceWidth) / 2;
  } else {
    sourceHeight = videoWidth / canvasRatio;
    sourceY = (videoHeight - sourceHeight) / 2;
  }

  ctx.drawImage(
    video,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    canvasWidth,
    canvasHeight,
  );
}

function makeImageSignature(source) {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(source, 0, 0, size, size);

  const imageData = ctx.getImageData(0, 0, size, size).data;

  const gray = new Float32Array(size * size);

  for (let i = 0; i < size * size; i += 1) {
    const r = imageData[i * 4];
    const g = imageData[i * 4 + 1];
    const b = imageData[i * 4 + 2];

    gray[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  const edges = [];

  for (let y = 1; y < size - 1; y += 1) {
    for (let x = 1; x < size - 1; x += 1) {
      const i = y * size + x;

      const gx = gray[i + 1] - gray[i - 1];
      const gy = gray[i + size] - gray[i - size];

      edges.push(Math.sqrt(gx * gx + gy * gy));
    }
  }

  const histogram = new Array(16).fill(0);

  for (let i = 0; i < gray.length; i += 1) {
    const bin = Math.min(15, Math.floor(gray[i] * 16));
    histogram[bin] += 1;
  }

  const total = gray.length;

  return {
    edges,
    histogram: histogram.map((value) => value / total),
  };
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (!normA || !normB) return 0;

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function histogramSimilarity(a, b) {
  let score = 0;

  for (let i = 0; i < a.length; i += 1) {
    score += Math.min(a[i], b[i]);
  }

  return score;
}

function compareImageSignatures(targetSignature, cameraSignature) {
  const edgeScore = cosineSimilarity(
    targetSignature.edges,
    cameraSignature.edges,
  );

  const histScore = histogramSimilarity(
    targetSignature.histogram,
    cameraSignature.histogram,
  );

  return edgeScore * 0.7 + histScore * 0.3;
}

function loadTargetImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("기준 이미지를 불러오지 못했습니다."));

    image.src = src;
  });
}

function ARScanGate({
  targetImage,
  matchThreshold = 0.55,
  maxFailCount = 3,
  onCompleted,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const targetSignatureRef = useRef(null);

  const [cameraError, setCameraError] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [lastScore, setLastScore] = useState(null);
  const [failCount, setFailCount] = useState(0);

  const fallbackVisible = failCount >= maxFailCount || !!cameraError;

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setCameraError("이 브라우저에서는 카메라를 사용할 수 없습니다.");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
          },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        setCameraError(
          "카메라 권한을 허용해야 간판 확인을 진행할 수 있습니다.",
        );
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleScan = async () => {
    if (isScanning || !videoRef.current) return;

    setIsScanning(true);
    setScanMessage("");

    try {
      const video = videoRef.current;

      if (!video.videoWidth || !video.videoHeight) {
        setScanMessage(
          "카메라가 아직 준비되지 않았습니다. 잠시 후 다시 시도하세요.",
        );
        setIsScanning(false);
        return;
      }

      if (!targetSignatureRef.current) {
        const target = await loadTargetImage(targetImage);
        targetSignatureRef.current = makeImageSignature(target);
      }

      const frameCanvas = document.createElement("canvas");
      frameCanvas.width = 480;
      frameCanvas.height = 640;

      const frameCtx = frameCanvas.getContext("2d", {
        willReadFrequently: true,
      });

      drawVideoCover(video, frameCtx, frameCanvas.width, frameCanvas.height);

      const guideX = frameCanvas.width * 0.09;
      const guideY = frameCanvas.height * 0.24;
      const guideW = frameCanvas.width * 0.82;
      const guideH = frameCanvas.height * 0.52;

      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = 320;
      cropCanvas.height = 203;

      const cropCtx = cropCanvas.getContext("2d", {
        willReadFrequently: true,
      });

      cropCtx.drawImage(
        frameCanvas,
        guideX,
        guideY,
        guideW,
        guideH,
        0,
        0,
        cropCanvas.width,
        cropCanvas.height,
      );

      const cameraSignature = makeImageSignature(cropCanvas);

      const score = compareImageSignatures(
        targetSignatureRef.current,
        cameraSignature,
      );

      setLastScore(score);

      if (score >= matchThreshold) {
        setScanMessage("간판 확인 완료. 다음 조사로 이동합니다.");

        setTimeout(() => {
          onCompleted?.();
        }, 700);

        return;
      }

      const nextFailCount = failCount + 1;
      setFailCount(nextFailCount);

      setScanMessage(
        `간판이 아직 충분히 맞지 않았습니다. 현재 유사도 ${Math.round(
          score * 100,
        )}% / 필요 유사도 ${Math.round(matchThreshold * 100)}%`,
      );
    } catch {
      setScanMessage("간판 판정 중 문제가 발생했습니다. 다시 시도하세요.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="arScanBox">
      <h3>간판 AR 확인</h3>

      <p>
        반투명 기준 이미지와 실제 가게 간판이 최대한 겹치도록 카메라를 맞춘 뒤
        판정하세요.
      </p>

      <div className="arCameraFrame">
        <video ref={videoRef} className="arVideo" autoPlay playsInline muted />

        {targetImage && (
          <img
            className="arOverlayImage"
            src={targetImage}
            alt="간판 기준 이미지"
          />
        )}

        <div className="arFrameGuide" />
      </div>

      {lastScore !== null && (
        <div className="arScoreBox">
          <div className="arScoreText">
            유사도 {Math.round(lastScore * 100)}%
          </div>
          <div className="arScoreMeter">
            <div
              className="arScoreFill"
              style={{
                width: `${Math.min(100, Math.round(lastScore * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      {cameraError && <p className="message">{cameraError}</p>}
      {scanMessage && <p className="message">{scanMessage}</p>}

      <button onClick={handleScan} disabled={isScanning || !targetImage}>
        {isScanning ? "간판을 판정하는 중..." : "간판 판정하기"}
      </button>

      {fallbackVisible && (
        <button
          className="secondaryButton"
          onClick={() => {
            setScanMessage("수동 확인으로 다음 조사에 진입합니다.");
            onCompleted?.();
          }}
        >
          인식이 계속 실패합니다
        </button>
      )}

      <p className="smallText">
        너무 어둡거나, 간판이 화면에서 작거나, 각도가 많이 틀어지면 유사도가
        낮게 나올 수 있습니다.
      </p>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("poster");
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
  const [missionPuzzleSolved, setMissionPuzzleSolved] = useState(false);
  const [arScanDone, setArScanDone] = useState(false);

  const currentNode = storyFlow[flowIndex] || storyFlow[0];

  useEffect(() => {
    setMissionPuzzleSolved(false);
    setArScanDone(false);
    setAnswer("");
    setMessage("");
  }, [flowIndex]);

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

      setScreen("poster");
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
      const acceptedAnswers = currentNode.acceptedAnswers || [
        currentNode.answer,
      ];

      const isCorrect = acceptedAnswers.some(
        (correct) => userAnswer === normalizeAnswer(correct),
      );

      if (!isCorrect) {
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

    setScreen("poster");
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

  const renderLandingContent = () => (
    <>
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

        <section className="card warning">
          <p className="sectionLabel">Notice</p>
          <h2>조사관 주의사항</h2>
          <p>길을 건널 때는 스마트폰을 보지 말고 주변을 확인해주세요.</p>
          <p>매장 영업을 방해하지 않도록 외부 단서 중심으로 진행해주세요.</p>
          <p>막히는 구간에서는 힌트를 사용해도 기록은 계속 이어집니다.</p>
        </section>

        <button className="mainStartButton" onClick={() => setScreen("code")}>
          조사 시작하기
        </button>
    </>
  );

  if (screen === "poster") {
    return (
      <main className="posterScrollPage">
        <section className="posterHeroSection">
          <div className="posterIntroCard">
            <img
              className="posterIntroImage"
              src="/poster-intro.png"
              alt="왕비 후보의 서찰 포스터"
            />
          </div>

          <div className="scrollGuide">
            <span>아래로 내려주세요</span>
            <strong>⌄</strong>
          </div>
        </section>

        <section className="page landingAfterPoster">
          {renderLandingContent()}
        </section>
      </main>
    );
  }

  if (screen === "landing") {
    return <main className="page">{renderLandingContent()}</main>;
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

              {currentNode.video && (
                <StoryVideo
                  src={currentNode.video}
                  poster={currentNode.videoPoster}
                />
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
            <p className="eyebrow">{currentNode.chapter}</p>
            <h1>{currentNode.title}</h1>

            <section className="card">
              <p className="sectionLabel">Location Guide</p>
              <h2>이동 안내</h2>

              {currentNode.letterParagraphs ? (
                <>
                  <p className="locationText">장소: {currentNode.location}</p>
                  <h3>{currentNode.letterTitle || "서찰"}</h3>
                  {currentNode.letterParagraphs.map((text, index) => (
                    <p key={`${currentNode.id}-letter-${index}`}>{text}</p>
                  ))}
                </>
              ) : (
                <p>{currentNode.location}</p>
              )}
            </section>

            <section className="card">
              <p className="sectionLabel">Case Record</p>
              <h2>{currentNode.recordTitle || "사건 기록"}</h2>

              {currentNode.recordParagraphs ? (
                currentNode.recordParagraphs.map((text, index) => (
                  <p key={`${currentNode.id}-record-${index}`}>{text}</p>
                ))
              ) : (
                <p>{currentNode.intro}</p>
              )}
            </section>

            <section className="card answerCard">
              <p className="sectionLabel">Investigation Question</p>
              <h2>조사 문제</h2>

              {currentNode.puzzleType === "tile-swap" ? (
                <>
                  <p>{currentNode.instruction}</p>

                  <TileSwapPuzzle
                    pieces={currentNode.puzzlePieces}
                    initialOrder={currentNode.initialOrder}
                    onSolved={() => {
                      setMissionPuzzleSolved(true);
                      setMessage("");
                    }}
                  />

                  {missionPuzzleSolved && !arScanDone && (
                    <>
                      <div className="ruleBox arBox">
                        <h3>{currentNode.afterPuzzleTitle}</h3>
                        <p>{currentNode.afterPuzzleText}</p>
                      </div>

                      <ARScanGate
                        targetImage={currentNode.arTargetImage}
                        matchThreshold={currentNode.arMatchThreshold || 0.55}
                        maxFailCount={currentNode.arMaxFailCount || 3}
                        onCompleted={() => {
                          setArScanDone(true);
                          setMessage("");
                        }}
                      />
                    </>
                  )}

                  {missionPuzzleSolved && arScanDone && (
                    <>
                      <div className="choiceQuestionBox">
                        <h3>{currentNode.choiceQuestion.title}</h3>
                        <p>{currentNode.choiceQuestion.description}</p>

                        <div className="choiceList">
                          {currentNode.choiceQuestion.choices.map((choice) => (
                            <button
                              key={choice.value}
                              type="button"
                              className={`choiceButton ${
                                answer === choice.value ? "selected" : ""
                              }`}
                              onClick={() => {
                                setAnswer(choice.value);
                                setMessage("");
                              }}
                            >
                              {choice.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        className="choiceSubmitButton"
                        onClick={submitMissionAnswer}
                        disabled={!answer}
                      >
                        단서 확인
                      </button>
                    </>
                  )}
                </>
              ) : currentNode.puzzleType === "stitch-connect" ? (
                <>
                  <p>{currentNode.instruction}</p>

                  {currentNode.rule && (
                    <div className="ruleBox">
                      {currentNode.rule.map((rule, index) => (
                        <p key={`${currentNode.id}-rule-${index}`}>{rule}</p>
                      ))}
                    </div>
                  )}

                  <StitchConnectPuzzle
                    image={currentNode.stitchImage}
                    points={currentNode.stitchPoints}
                    correctPairs={currentNode.stitchPairs}
                    onSolved={() => {
                      setMissionPuzzleSolved(true);
                      setAnswer(currentNode.answer || "STITCH_SOLVED");
                      setMessage("");
                    }}
                  />

                  {missionPuzzleSolved && (
                    <>
                      <div className="ruleBox">
                        <h3>{currentNode.solvedTitle || "복원 완료"}</h3>
                        <p>{currentNode.solvedText}</p>
                      </div>

                      <button
                        className="choiceSubmitButton"
                        onClick={submitMissionAnswer}
                      >
                        단서 확인
                      </button>
                    </>
                  )}
                </>
              ) : currentNode.contentBlocks ? (
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
                </div>
              ) : (
                <>
                  <p>{currentNode.instruction}</p>

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
                </>
              )}

              {message && <p className="message">{message}</p>}
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
          <p>
            다음 화면을 제시하면 클리어 인증과 연계 혜택을 받을 수 있습니다.
          </p>
        </section>

        <section className="card">
          <p className="sectionLabel">Reward</p>
          <h2>보상 안내</h2>
          <p>다음 화면을 제시하면 메리골드 클리어 혜택을 받을 수 있습니다.</p>
        </section>

        <button onClick={() => setScreen("coupon")}>
          메리골드 쿠폰 확인하기
        </button>

        <button className="secondaryButton" onClick={resetGame}>
          처음부터 다시 하기
        </button>
      </main>
    );
  }

  if (screen === "coupon") {
    const couponExpireDateText = getCouponExpireDateText();

    return (
      <main className="page centerPage">
        <p className="eyebrow">Marigold Coupon</p>
        <h1>메리골드 클리어 혜택</h1>

        <section className="card couponCard">
          <p className="sectionLabel">Reward Coupon</p>
          <h2>공방거리 탐정단 특별 쿠폰</h2>

          <div className="couponStampBox">
            <span>MERIGOLD</span>
            <strong>방탈출 클리어 인증</strong>
          </div>

          <p>
            이 화면을 메리골드 매장에 제시하면, 현장에서 사용 가능한 클리어
            혜택을 받을 수 있습니다.
          </p>

          <div className="couponInfoBox">
            <p>
              <strong>사용처</strong>
              <span>메리골드</span>
            </p>
            <p>
              <strong>사용 기한</strong>
              <span>~ {couponExpireDateText}</span>
            </p>
            <p>
              <strong>조사관</strong>
              <span>{teamName}</span>
            </p>
          </div>

          <p className="smallText">
            바코드 없이 매장 확인용으로 사용하는 쿠폰입니다. 매장 직원 확인 후
            혜택이 적용됩니다.
          </p>
        </section>

        <button onClick={() => setScreen("leaderboard")}>
          오늘의 조사 랭킹 보기
        </button>

        <button className="secondaryButton" onClick={() => setScreen("clear")}>
          클리어 인증으로 돌아가기
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
