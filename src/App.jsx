import { useEffect, useState } from "react";
import { gameInfo, missions } from "./data/gameData";
import { dummyLeaderboard } from "./data/leaderboardData";
import { formatTime, getClearTitle, getHintEnding } from "./utils/timeUtils";
import heroImg from "./assets/hero.png";
import "./styles.css";

const SAVE_KEY = "royalLetterEscapeSave";
const OLD_SAVE_KEY = "marigoldEscapeSave";

const defaultTraits = {
  structure: 0,
  precision: 0,
  color: 0,
  form: 0,
  story: 0,
};

const workshopRecommendations = {
  1: {
    title: "규방공예 추천형",
    workshop: "규방공예 / 색실·매듭 공방",
    statName: "색실 관찰 감각",
    description:
      "끊어진 매듭의 색실을 가장 빠르게 파악했습니다. 색, 실, 장식처럼 섬세한 시각 단서에 강한 타입입니다.",
    recommendedCrafts: [
      "매듭 팔찌 만들기",
      "색실 장식 만들기",
      "규방공예 소품 체험",
    ],
  },
  2: {
    title: "종이꽃 해석형",
    workshop: "종이노리 / 종이 공방",
    statName: "종이 단서 해석",
    description:
      "종이꽃의 꽃잎 수와 중심 장식을 빠르게 비교했습니다. 종이, 서찰, 엽서처럼 이야기와 형태가 함께 담긴 공예에 잘 어울립니다.",
    recommendedCrafts: ["종이꽃 만들기", "한지 엽서 만들기", "서찰 카드 제작"],
  },
  3: {
    title: "향기도예 감식형",
    workshop: "향기도예 / 도예 공방",
    statName: "향과 문양 감식",
    description:
      "깨진 향 도자기의 조건을 빠르게 구분했습니다. 형태, 향, 문양을 비교하며 물건의 차이를 읽는 데 강한 타입입니다.",
    recommendedCrafts: [
      "도자기 핸드빌딩",
      "향 도자기 만들기",
      "타일 문양 꾸미기",
    ],
  },
  4: {
    title: "초상 복원형",
    workshop: "초상 / 엽서 / 그림 조각 체험",
    statName: "장면 복원 감각",
    description:
      "잘린 초상 조각을 빠르게 해석했습니다. 흩어진 장면을 맞추고, 보이지 않던 맥락을 복원하는 데 강한 타입입니다.",
    recommendedCrafts: ["엽서 콜라주", "그림 조각 맞추기", "투명 필름 아트"],
  },
  5: {
    title: "장신구 암호형",
    workshop: "장신구 공방",
    statName: "숫자 조합 감각",
    description:
      "이전 단서의 숫자를 빠르게 조합해 약속 팔찌의 비밀번호를 풀었습니다. 각인, 장신구, 기념품 제작 체험에 잘 어울립니다.",
    recommendedCrafts: ["팔찌 만들기", "금속 각인 체험", "약속 증표 만들기"],
  },
};

function getFastestWorkshop(missionTimes) {
  const entries = Object.entries(missionTimes)
    .map(([missionId, seconds]) => [Number(missionId), seconds])
    .filter(([missionId]) => missionId >= 1 && missionId <= 5);

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

function sanitizeScreen(screen) {
  const legacyScreens = ["customize", "story"];
  if (legacyScreens.includes(screen)) return "teaser";
  return screen || "landing";
}

function clampMissionIndex(index) {
  if (!Number.isInteger(index)) return 0;
  if (index < 0) return 0;
  if (index >= missions.length) return 0;
  return index;
}

function App() {
  const [screen, setScreen] = useState("landing");
  const [inputCode, setInputCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [missionIndex, setMissionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [openedHints, setOpenedHints] = useState([]);
  const [hintCount, setHintCount] = useState(0);
  const [pieces, setPieces] = useState([]);
  const [message, setMessage] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [clearTimeSeconds, setClearTimeSeconds] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [isLoaded, setIsLoaded] = useState(false);
  const [traits, setTraits] = useState(defaultTraits);
  const [missionStartTime, setMissionStartTime] = useState(null);
  const [missionTimes, setMissionTimes] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);

  const currentMission = missions[missionIndex] || missions[0];
  const workshopResult = getFastestWorkshop(missionTimes);

  useEffect(() => {
    if (import.meta.env.DEV) {
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(OLD_SAVE_KEY);

      setScreen("landing");
      setInputCode("");
      setTeamName("");
      setMissionIndex(0);
      setAnswer("");
      setOpenedHints([]);
      setHintCount(0);
      setPieces([]);
      setMessage("");
      setStartTime(null);
      setClearTimeSeconds(null);
      setTraits(defaultTraits);
      setMissionStartTime(null);
      setMissionTimes({});
      setSelectedRecord(null);
      setIsLoaded(true);
      return;
    }

    const saved = localStorage.getItem(SAVE_KEY);

    if (saved) {
      const data = JSON.parse(saved);

      setScreen(sanitizeScreen(data.screen));
      setInputCode(data.inputCode || "");
      setTeamName(data.teamName || "");
      setMissionIndex(clampMissionIndex(data.missionIndex));
      setOpenedHints(data.openedHints || []);
      setHintCount(data.hintCount || 0);
      setPieces(data.pieces || []);
      setStartTime(data.startTime || null);
      setClearTimeSeconds(data.clearTimeSeconds || null);
      setTraits(data.traits || defaultTraits);
      setMissionStartTime(data.missionStartTime || null);
      setMissionTimes(data.missionTimes || {});
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
      missionIndex,
      openedHints,
      hintCount,
      pieces,
      startTime,
      clearTimeSeconds,
      traits,
      missionStartTime,
      missionTimes,
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  }, [
    isLoaded,
    screen,
    inputCode,
    teamName,
    missionIndex,
    openedHints,
    hintCount,
    pieces,
    startTime,
    clearTimeSeconds,
    traits,
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

    if (!gameInfo.validCodes.includes(normalizedCode)) {
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
    setScreen("teaser");
  };

  const startAdventure = () => {
    const nowTime = Date.now();

    setStartTime(nowTime);
    setMissionStartTime(nowTime);
    setScreen("mission");
  };

  const openHint = (hintIndex) => {
    const hintKey = `${currentMission.id}-${hintIndex}`;

    if (!openedHints.includes(hintKey)) {
      setOpenedHints([...openedHints, hintKey]);
      setHintCount(hintCount + 1);
    }
  };

  const isHintOpen = (hintIndex) => {
    const hintKey = `${currentMission.id}-${hintIndex}`;
    return openedHints.includes(hintKey);
  };

  const submitAnswer = () => {
    const normalizeAnswer = (value) =>
      value.trim().toLowerCase().replace(/\s/g, "");

    const userAnswer = normalizeAnswer(answer);
    const correctAnswer = normalizeAnswer(currentMission.answer);

    if (userAnswer !== correctAnswer) {
      setMessage(
        "아직 진실에 닿지 못했습니다. 단서와 힌트를 다시 확인해보세요.",
      );
      return;
    }

    const nextPieces = pieces.includes(currentMission.piece)
      ? pieces
      : [...pieces, currentMission.piece];

    const solvedAt = Date.now();
    const spentSeconds = missionStartTime
      ? Math.max(1, Math.floor((solvedAt - missionStartTime) / 1000))
      : 0;

    setMissionTimes((prev) => ({
      ...prev,
      [currentMission.id]: spentSeconds,
    }));

    setPieces(nextPieces);
    setAnswer("");
    setMessage("");
    setScreen("piece");
  };

  const selectTrait = (traitKey) => {
    setTraits((prev) => ({
      ...prev,
      [traitKey]: prev[traitKey] + 1,
    }));

    setScreen("piece");
  };

  const goNextMission = () => {
    if (missionIndex + 1 >= missions.length) {
      const endTime = Date.now();
      const totalSeconds = Math.floor((endTime - startTime) / 1000);
      setClearTimeSeconds(totalSeconds);
      setMessage("");
      setScreen("clear");
      return;
    }

    setMissionIndex(missionIndex + 1);
    setMissionStartTime(Date.now());
    setMessage("");
    setScreen("mission");
  };

  const resetGame = () => {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(OLD_SAVE_KEY);

    setScreen("landing");
    setInputCode("");
    setTeamName("");
    setMissionIndex(0);
    setAnswer("");
    setOpenedHints([]);
    setHintCount(0);
    setPieces([]);
    setMessage("");
    setStartTime(null);
    setClearTimeSeconds(null);
    setTraits(defaultTraits);
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
            alt="왕 B, 왕비 후보 1, 왕비 후보 2"
          />
          <div className="heroOverlay" />
          <div className="heroContent">
            <p className="eyebrow">궁중 공방 미스터리 야외 방탈출</p>
            <h1>{gameInfo.title}</h1>
            <p className="heroSubtitle">{gameInfo.subtitle}</p>
            <p className="heroCopy">
              어릴 적 약속한 두 사람.
              <br />
              그러나 궁은 다른 선택을 원했다.
            </p>

            <div className="royalStatRow">
              <span className="royalStat">⏳ {gameInfo.playTime}</span>
              <span className="royalStat">👥 {gameInfo.players}</span>
              <span className="royalStat">📍 행궁동 공방거리</span>
            </div>
          </div>
        </section>

        <section className="card">
          <p className="sectionLabel">Investigation Guide</p>
          <h2>조사 안내</h2>
          <ul>
            <li>예상 시간: {gameInfo.playTime}</li>
            <li>권장 인원: {gameInfo.players}</li>
            <li>준비물: {gameInfo.requiredItems.join(", ")}</li>
          </ul>
        </section>

        <section className="card">
          <p className="sectionLabel">Kit Contents</p>
          <h2>봉투 속 단서</h2>
          <ul>
            {gameInfo.kitItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="card">
          <p className="sectionLabel">Clue Preview</p>
          <h2>흔들리는 혼례의 단서</h2>
          <div className="pieceGrid">
            <span className="piece">끊어진 매듭</span>
            <span className="piece">꽃잎 속 서찰</span>
            <span className="piece">깨진 향 도자기</span>
            <span className="piece">잘린 초상</span>
            <span className="piece">사라진 팔찌</span>
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

  if (screen === "teaser") {
    return (
      <main className="page">
        <p className="eyebrow">Prologue Teaser</p>
        <h1>혼례 전날, 진실은 아직 닫혀 있다</h1>

        <section className="teaserPanel">
          <video
            className="teaserVideo"
            src="/teaser.mp4"
            poster="/teaser-poster.png"
            controls
            playsInline
          >
            사용 중인 브라우저에서 영상을 재생할 수 없습니다.
          </video>
        </section>

        <section className="card">
          <p className="sectionLabel">Prologue</p>
          <h2>왕비 후보의 서찰</h2>
          <p>
            왕 B와 왕비 후보 1은 어릴 적부터 이어진 약속을 간직한 사이였다.
            그러나 궁은 또 다른 후보를 원했고, 혼례를 앞둔 어느 날 수상한
            단서들이 하나씩 도착하기 시작한다.
          </p>
          <p>
            끊어진 매듭, 꽃잎 속 서찰, 깨진 향, 함께 있는 초상, 사라진 팔찌.
            왕의 마음은 정말 변한 것인가.
          </p>
        </section>

        <section className="card">
          <p className="sectionLabel">Mission Objective</p>
          <h2>조사 목표</h2>
          <p>
            행궁동 공방거리 곳곳에 남겨진 단서를 따라가며, 혼례 전날 닫혀 있던
            진실을 밝혀내세요.
          </p>
        </section>

        <button onClick={startAdventure}>단서를 따라가기</button>

        <button className="secondaryButton" onClick={() => setScreen("team")}>
          조사관 이름 다시 입력하기
        </button>
      </main>
    );
  }

  if (screen === "mission") {
    return (
      <main className="page">
        <header className="missionHeader">
          <span>
            단서 {missionIndex + 1} / {missions.length}
          </span>
          <span>{formatTime(elapsedSeconds)}</span>
        </header>

        <h1>{currentMission.title}</h1>

        <section className="card">
          <p className="sectionLabel">Case Record</p>
          <h2>사건 기록</h2>
          <p>{currentMission.story}</p>
        </section>

        <section className="card">
          <p className="sectionLabel">Location Guide</p>
          <h2>이동 안내</h2>
          <p>{currentMission.locationGuide}</p>
        </section>

        <section className="card answerCard">
          <p className="sectionLabel">Investigation Question</p>
          <h2>조사 문제</h2>
          <p>{currentMission.question}</p>

          <div className="answerBox">
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="정답을 입력하세요"
            />

            <button onClick={submitAnswer}>단서 확인</button>
          </div>
        </section>

        <section className="card hintCard">
          <p className="sectionLabel">Hint</p>
          <h2>힌트</h2>

          {currentMission.hints.map((hint, index) => (
            <div key={index} className="hintBlock">
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
      </main>
    );
  }

  if (screen === "trait") {
    const traitQuestion = currentMission.traitQuestion;

    return (
      <main className="page centerPage">
        <p className="eyebrow">Investigation Tendency</p>
        <h1>방금 단서에서</h1>

        <section className="card">
          <p className="sectionLabel">Choice Record</p>
          <h2>{traitQuestion.question}</h2>
          <div className="traitOptionList">
            {traitQuestion.options.map((option) => (
              <button
                key={option.trait + option.label}
                className="traitOptionButton"
                onClick={() => selectTrait(option.trait)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <p className="smallText">
          선택 결과는 마지막에 나의 조사 성향 카드로 이어집니다.
        </p>
      </main>
    );
  }

  if (screen === "piece") {
    return (
      <main className="page centerPage">
        <p className="eyebrow">Clue Secured</p>
        <h1>{currentMission.piece} 획득</h1>
        <p>혼례의 진실에 가까워지는 단서 하나를 확보했습니다.</p>
        <button onClick={goNextMission}>
          {missionIndex + 1 >= missions.length
            ? "최종 기록 확인하기"
            : "다음 단서로"}
        </button>
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
            조사 진행률 {missionIndex + 1} / {missions.length}
          </p>
          <div className="progressBar">
            <div
              className="progressFill"
              style={{
                width: `${((missionIndex + 1) / missions.length) * 100}%`,
              }}
            />
          </div>
        </section>

        <section className="card">
          <p className="sectionLabel">Craft Street Map</p>
          <h2>공방거리 조사 지도</h2>
          <div className="clueMap">
            {missions.map((mission, index) => {
              const isCleared = pieces.includes(mission.piece);
              const isCurrent = index === missionIndex;

              return (
                <div
                  key={mission.id}
                  className={`clueMapItem ${
                    isCleared ? "cleared" : isCurrent ? "current" : "locked"
                  }`}
                >
                  <span>{mission.id}</span>
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
            {missions.map((mission) => (
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

        <section className="card">
          <p className="sectionLabel">Investigation Type</p>
          <h2>현재 조사 성향</h2>
          <ul>
            <li>구조 감각: {traits.structure}</li>
            <li>정밀 해석: {traits.precision}</li>
            <li>색채 감각: {traits.color}</li>
            <li>조형 감각: {traits.form}</li>
            <li>기록 감성: {traits.story}</li>
          </ul>
        </section>

        <button onClick={() => setScreen("mission")}>조사로 돌아가기</button>
      </main>
    );
  }

  if (screen === "clear") {
    const clearTitle = getClearTitle(clearTimeSeconds, hintCount);
    const hintEnding = getHintEnding(hintCount);

    return (
      <main className="page centerPage">
        <p className="eyebrow">Truth Revealed</p>
        <h1>진실 확인</h1>

        <section className="card">
          <p className="sectionLabel">Final Letter</p>
          <h2>왕비 후보의 서찰</h2>
          <p>
            모든 단서는 왕의 마음이 변했다는 방향으로 후보 1을 흔들고 있었다.
          </p>
          <p>
            그러나 매듭은 스스로 풀린 것이 아니라 잘려 있었고, 종이꽃은 진짜가
            아니었다. 향 도자기의 향과 문양도 달랐으며, 초상은 일부만 잘려
            있었다.
          </p>
          <p>사라졌다던 팔찌는 버려진 것이 아니라 숨겨져 있었다.</p>
          <p>
            <strong>“오래된 약속은 아직 끊어지지 않았다.”</strong>
          </p>
        </section>

        <section className="card certificateCard">
          <p className="eyebrow">CLEAR CERTIFICATE</p>
          <h2>혼례의 진실을 밝힌 조사관</h2>

          <p>조사관: {teamName}</p>
          <p>조사 시간: {formatTime(clearTimeSeconds)}</p>
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
                  <span>
                    {record.traitTitle ? record.traitTitle : "조사관형"}
                  </span>
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
