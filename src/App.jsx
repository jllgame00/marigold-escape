import { useEffect, useState } from "react";
import { gameInfo, missions } from "./data/gameData";
import { dummyLeaderboard } from "./data/leaderboardData";
import { formatTime, getClearTitle, getHintEnding } from "./utils/timeUtils";
import "./styles.css";

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

  const currentMission = missions[missionIndex];

  useEffect(() => {
    const saved = localStorage.getItem("marigoldEscapeSave");

    if (saved) {
      const data = JSON.parse(saved);

      setScreen(data.screen || "landing");
      setInputCode(data.inputCode || "");
      setTeamName(data.teamName || "");
      setMissionIndex(data.missionIndex || 0);
      setOpenedHints(data.openedHints || []);
      setHintCount(data.hintCount || 0);
      setPieces(data.pieces || []);
      setStartTime(data.startTime || null);
      setClearTimeSeconds(data.clearTimeSeconds || null);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

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
    };

    localStorage.setItem("marigoldEscapeSave", JSON.stringify(saveData));
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
      setMessage("입장 코드가 올바르지 않습니다.");
      return;
    }

    setMessage("");
    setScreen("team");
  };

  const handleTeamSubmit = () => {
    if (teamName.trim().length < 2) {
      setMessage("팀명을 2글자 이상 입력해주세요.");
      return;
    }

    setMessage("");
    setScreen("story");
  };

  const startAdventure = () => {
    setStartTime(Date.now());
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
      setMessage("정답이 아닙니다. 단서와 힌트를 다시 확인해보세요.");
      return;
    }

    const nextPieces = pieces.includes(currentMission.piece)
      ? pieces
      : [...pieces, currentMission.piece];

    setPieces(nextPieces);
    setAnswer("");
    setMessage("");

    if (missionIndex + 1 >= missions.length) {
      const endTime = Date.now();
      const totalSeconds = Math.floor((endTime - startTime) / 1000);
      setClearTimeSeconds(totalSeconds);
      setScreen("clear");
      return;
    }

    setScreen("piece");
  };

  const goNextMission = () => {
    setMissionIndex(missionIndex + 1);
    setMessage("");
    setScreen("mission");
  };

  const resetGame = () => {
    localStorage.removeItem("marigoldEscapeSave");

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
  };

  const myRecord =
    clearTimeSeconds !== null
      ? {
          teamName,
          clearTimeSeconds,
          hintCount,
        }
      : null;

  const leaderboard = [
    ...dummyLeaderboard,
    ...(myRecord ? [myRecord] : []),
  ].sort((a, b) => a.clearTimeSeconds - b.clearTimeSeconds);

  if (!isLoaded) {
    return (
      <main className="page">
        <p>불러오는 중...</p>
      </main>
    );
  }

  if (screen === "landing") {
    return (
      <main className="page">
        <section className="hero">
          <p className="eyebrow">Marigold Outdoor Escape</p>
          <h1>{gameInfo.title}</h1>
          <p>{gameInfo.subtitle}</p>
        </section>

        <section className="card">
          <h2>플레이 안내</h2>
          <ul>
            <li>예상 시간: {gameInfo.playTime}</li>
            <li>권장 인원: {gameInfo.players}</li>
            <li>준비물: {gameInfo.requiredItems.join(", ")}</li>
          </ul>
        </section>

        <section className="card">
          <h2>키트 구성품</h2>
          <ul>
            {gameInfo.kitItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="card warning">
          <h2>주의사항</h2>
          <p>길을 건널 때는 스마트폰을 보지 말고 주변을 확인해주세요.</p>
          <p>매장 영업을 방해하지 않도록 외부 단서 중심으로 진행해주세요.</p>
          <p>단서가 보이지 않을 경우 힌트를 사용해주세요.</p>
        </section>

        <button onClick={() => setScreen("code")}>시작하기</button>
      </main>
    );
  }

  if (screen === "code") {
    return (
      <main className="page">
        <h1>입장 코드 입력</h1>
        <p>봉투 안쪽 카드에 적힌 입장 코드를 입력해주세요.</p>

        <input
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="예: MG-001"
        />

        <button onClick={handleCodeSubmit}>입장하기</button>

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
          코드가 없다면 메리골드에서 야외방탈출 키트를 구매해주세요.
        </p>

        {message && <p className="message">{message}</p>}
      </main>
    );
  }

  if (screen === "team") {
    return (
      <main className="page">
        <h1>팀명 입력</h1>
        <p>오늘의 팀 이름을 정해주세요. 클리어 후 랭킹에 표시됩니다.</p>

        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="예: 수작왕"
        />

        <button onClick={handleTeamSubmit}>다음</button>

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
          실명이나 개인정보는 입력하지 않는 것을 권장합니다.
        </p>

        {message && <p className="message">{message}</p>}
      </main>
    );
  }

  if (screen === "story") {
    return (
      <main className="page">
        <h1>프롤로그</h1>

        <div className="videoBox">
          <p>사라진 장인의 기록</p>
        </div>

        <section className="card">
          <p>
            오래전 공방거리에는 네 개의 조각이 흩어져 있었다. 메리골드에서
            발견된 봉투는 그 조각들을 다시 이어줄 단서였다.
          </p>
          <p>봉투 속 물건과 거리의 흔적을 따라 마지막 암호를 찾아보자.</p>
        </section>

        <button onClick={startAdventure}>탐험 시작</button>

        <button
          className="secondaryButton"
          onClick={() => {
            setMessage("");
            setScreen("team");
          }}
        >
          팀명 다시 입력하기
        </button>
      </main>
    );
  }

  if (screen === "mission") {
    return (
      <main className="page">
        <header className="missionHeader">
          <span>
            Mission {missionIndex + 1} / {missions.length}
          </span>
          <span>{formatTime(elapsedSeconds)}</span>
        </header>

        <h1>{currentMission.title}</h1>

        <section className="card">
          <h2>스토리</h2>
          <p>{currentMission.story}</p>
        </section>

        <section className="card">
          <h2>이동 안내</h2>
          <p>{currentMission.locationGuide}</p>
        </section>

        <section className="card">
          <h2>문제</h2>
          <p>{currentMission.question}</p>

          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="정답 입력"
          />

          <button onClick={submitAnswer}>정답 제출</button>
        </section>

        <section className="card">
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
          진행 상황 보기
        </button>

        {message && <p className="message">{message}</p>}
      </main>
    );
  }

  if (screen === "piece") {
    return (
      <main className="page centerPage">
        <p className="eyebrow">Mission Clear</p>
        <h1>{currentMission.piece} 획득</h1>
        <p>공방거리의 숨겨진 조각 하나를 찾아냈습니다.</p>
        <button onClick={goNextMission}>다음 미션으로</button>
      </main>
    );
  }

  if (screen === "progress") {
    return (
      <main className="page">
        <h1>진행 상황</h1>

        <section className="card">
          <p>
            진행률 {missionIndex + 1} / {missions.length}
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
          <h2>획득한 조각</h2>
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

        <button onClick={() => setScreen("mission")}>미션으로 돌아가기</button>
      </main>
    );
  }

  if (screen === "clear") {
    const clearTitle = getClearTitle(clearTimeSeconds, hintCount);
    const hintEnding = getHintEnding(hintCount);

    return (
      <main className="page centerPage">
        <p className="eyebrow">Clear</p>
        <h1>클리어!</h1>

        <section className="card">
          <h2>마지막 어찰</h2>
          <p>
            마지막 어찰에는 거대한 보물의 위치도, 엄청난 비밀도 적혀 있지
            않았다.
          </p>
          <p>그곳에는 단 한 문장만 남아 있었다.</p>
          <p>
            <strong>“장인은 사라져도, 기술은 남는다.”</strong>
          </p>
          <p>
            그리고 아래에는 새로운 기록을 남길 수 있는 빈칸이 있었다. 당신은
            마지막 도장을 찍으며, 사라진 기록의 마지막 계승자가 되었다.
          </p>
        </section>

        <section className="card certificateCard">
          <p className="eyebrow">CLEAR CERTIFICATE</p>
          <h2>사라진 장인의 기록을 완성한 계승자</h2>
          <p>팀명: {teamName}</p>
          <p>클리어 시간: {formatTime(clearTimeSeconds)}</p>
          <p>힌트 사용: {hintCount}회</p>
          <p>획득 칭호: {clearTitle}</p>
          <p>엔딩 평가: {hintEnding}</p>
        </section>

        <section className="card">
          <h2>보상 안내</h2>
          <p>이 화면을 메리골드에 보여주면 클리어 인증을 받을 수 있습니다.</p>
        </section>

        <button onClick={() => setScreen("leaderboard")}>
          오늘의 랭킹 보기
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
        <h1>오늘의 탐험가 랭킹</h1>
        <p className="smallText">
          매일 00:00 기준으로 새로운 랭킹이 시작됩니다.
        </p>

        <section className="card">
          {leaderboard.map((record, index) => (
            <div key={`${record.teamName}-${index}`} className="rankRow">
              <span>{index + 1}위</span>
              <strong>{record.teamName}</strong>
              <span>{formatTime(record.clearTimeSeconds)}</span>
              <span>힌트 {record.hintCount}회</span>
            </div>
          ))}
        </section>

        <button onClick={() => setScreen("clear")}>클리어 화면으로</button>
      </main>
    );
  }

  return null;
}

export default App;
