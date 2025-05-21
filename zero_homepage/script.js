// --- 설정값 ---
const SPEAKING_AVATAR_VIDEO_SRC = 'videos/speaking.mp4'; // 말하는 아바타 영상 경로
const IDLE_AVATAR_VIDEO_SRC = 'videos/idle_loop.mp4';   // 대기 상태 아바타 루프 영상 경로
const YOUR_CONTACT_EMAIL = 'aistonehub@gmail.com'; // 실제 이메일 주소

// --- DOM 요소 가져오기 ---
const avatarVideo = document.getElementById('avatarVideo');
const videoSource = document.getElementById('videoSource');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const faqButtonsContainer = document.getElementById('faqButtons');
const speechBubble = document.getElementById('speechBubble');
const answerTextElement = document.getElementById('answerText');
document.getElementById('currentYear').textContent = new Date().getFullYear();

// 이메일 링크 업데이트 (HTML에도 직접 반영했지만, JS로도 한 번 더 확인)
const emailLink = document.querySelector('footer a[href^="mailto:"]');
if (emailLink) {
    emailLink.href = `mailto:${YOUR_CONTACT_EMAIL}`;
    emailLink.textContent = YOUR_CONTACT_EMAIL;
}

// prerecordedAudio 객체 추가 - mp3 파일 사용
const prerecordedAudio = {
    "회사소개": "audio/company_intro.mp3",
    "주요사업": "audio/main_business.mp3",
    "핵심역량": "audio/core_capability.mp3",
    "컨설팅비용": "audio/consulting_cost.mp3",
    "개발경험": "audio/dev_experience.mp3",
    "문의": "audio/inquiry.mp3"
};

// --- 답변 데이터 (faq_list_for_avatar 기반) ---
const answerMap = {
    // 회사 기본 정보
    "회사소개": "저희는 ai stone (에이아이스톤)입니다. 기술 기반 가치 혁신을 추구하며, AI와 전문가 네트워크를 통해 기업의 잠재력 발굴을 돕는 파트너입니다.",
    "설립일": "저희는 2020년 11월에 설립되었습니다.",
    "대표": "저희 ai stone의 대표는 문윤수입니다. 약 20년간의 소프트웨어 개발 사업 경험과 AI/데이터 기술 전문성을 바탕으로 기업 가치 혁신에 기여하고자 합니다.",
    "주요사업": "저희는 AI 및 데이터 기반의 기술 컨설팅과 플랫폼 개발을 주요 사업 분야로 하고 있습니다.",
    "주요기술": "저희는 인공지능(AI), 데이터 분석, 소프트웨어 개발, 그리고 IPFS 기술을 핵심적으로 활용하고 있습니다.",
    // 비전과 미션
    "비전": "저희 비전은 AI를 통한 기술 혁신으로 여러 산업 분야에서 새로운 잠재 가치를 실현하고, 지속 성장하는 비즈니스 생태계를 구축하는 것입니다.",
    "미션": "저희 미션은 고객분들께 쉽고 빠르고 저렴한 솔루션을 제공하는 것입니다.",
    // 핵심 역량 및 차별점
    "핵심역량": "저희는 고도화된 AI 기반 분석 엔진, 20년 경험의 소프트웨어 사업 노하우, 그리고 IPFS 기반의 안전하고 신뢰성 있는 데이터 처리 기술을 핵심 역량으로 보유하고 있습니다.",
    "분석엔진": "저희 AI 분석 엔진은 복잡한 가치 평가 방법론을 내재화하고 있으며, 재무 및 비재무 데이터의 복합적인 영향을 분석하여 객관적이고 신뢰성 높은 가치 분석 결과를 제공합니다.",
    "개발경험": "20년간의 경험을 통해 대규모 데이터 처리 및 복잡한 비즈니스 로직을 위한 견고하고 확장 가능한 시스템 구축 경험을 가지고 있으며, 비전문가도 쉽게 사용할 수 있는 사용자 친화적 인터페이스 개발 역량도 갖추고 있습니다.",
    "데이터보안": "네, 그렇습니다. 저희는 IPFS 기반 데이터 보안 솔루션 개발 경험을 바탕으로 기업의 핵심 자산인 데이터를 안전하게 수집, 저장, 분석하는 프로세스를 구축하고 데이터 무결성을 확보합니다.",
    "차별점": "저희는 AI의 효율성과 객관성에 더해, 법률, 회계, 경영, 기술 등 각 분야 최고 전문가 그룹의 경험과 통찰을 결합한 융합적 솔루션을 제공합니다. 이를 통해 단순 가치 평가를 넘어 실질적인 가치 향상으로 이어지는 도움을 드립니다.",
    "전문가네트워크": "저희는 법률, 회계, 경영, 기술 등 각 분야의 저명한 교수님, 회계법인 대표님, IT 기업 기술 임원 등으로 구성된 자문단을 통해 AI 분석 결과에 깊이 있는 비즈니스 통찰과 현실적인 해법을 더하고 있습니다.",
    // 주요 사업 영역 및 서비스
    "사업영역": "저희의 주요 사업 영역은 AI 기반 기업 가치 관리 플랫폼 개발과 가치 혁신 컨설팅 서비스 제공입니다.",
    "가치관리플랫폼": "중소·중견 기업을 위한 혁신적인 셀프 기업 가치 진단 및 관리 툴을 개발하고 있습니다. 간편한 AI 기반 가치 진단, 가치 변화 추이 모니터링, 핵심 지표 분석 대시보드, AI 기반 가치 향상 액션 아이디어 제시 등의 기능을 제공하여 기업 가치 관리의 대중화 및 상시화를 목표로 합니다.",
    "가치혁신컨설팅": "AI 분석을 기반으로 한 심층적인 기업 가치 평가, 가치 결정 요인 및 잠재력 분석, 그리고 기업 가치 향상을 위한 맞춤형 전략 컨설팅을 제공합니다. 데이터 기반 경영 및 재무 관리 역량 강화 자문도 포함됩니다.",
    "컨설팅진행방식": "저희는 먼저 안전하고 체계적으로 데이터를 수집 및 정제하고, AI 기반으로 심층 분석을 진행합니다. 그 결과를 바탕으로 전문가가 검토하여 통찰을 더하고, 고객 맞춤형 솔루션을 도출하여 이해하기 쉬운 보고서와 함께 전달해 드립니다. 필요시 설명 세션도 진행합니다.",
    "컨설팅비용": `네, 저희 컨설팅 서비스는 고객사의 니즈와 기대 결과물의 수준에 맞춰 4가지 레벨로 제공됩니다. 'Value Snapshot'은 100만원, 'Value Insights'는 400만원, 'Value Acceleration'은 800만원이며, 'Strategic Partnership' 레벨은 별도 협의를 통해 맞춤 설계됩니다. 각 레벨별 상세 내용은 ${YOUR_CONTACT_EMAIL} 로 문의해주시면 안내드리겠습니다.`,
    "컨설팅필요기업": "회사의 현재 가치를 빠르게 파악하고 싶거나, 가치 구성 요소를 심층적으로 이해하고 개선 방향을 찾고 싶은 기업, 또는 구체적인 가치 향상 전략과 실행 아이디어를 얻고 M&A나 투자 유치 등 특정 목적을 달성하고자 하는 모든 기업에게 저희 서비스가 도움이 될 수 있습니다.",
    // 기타
    "회사연혁": "저희는 2020년 11월 설립 이후, IPFS 기반 데이터 솔루션 개발 및 납품, AI Agent 개발 및 납품 등의 성과를 거두며 기술력을 축적해왔습니다. 현재는 기업 가치 혁신을 위한 AI/데이터 분석 솔루션 및 컨설팅 서비스 연구 개발에 집중하고 있습니다.",
    "조직구조": "저희는 20년 SW 사업 경험을 가진 리더를 중심으로, 소수 정예 인력과 검증된 외부 파트너가 협력하는 유연하고 민첩한 조직 구조를 가지고 있습니다. 이를 통해 프로젝트 특성에 맞는 최적의 AI 전문 리소스를 투입하고 불필요한 고정 비용을 최소화합니다.",
    "팀멤버": "저희 팀에는 설립자이신 문윤수 대표님을 비롯하여, 핵심 개발을 담당하는 AI 수진님, 고객 관리를 맡고 있는 AI 미연님 등 열정적인 전문가들이 함께하고 있습니다.",
    "주요파트너": "저희는 기술 파트너, 법률 자문, 회계/세무 자문, 경영/전략 자문, 기술/연구 자문 등 각 분야의 신뢰할 수 있는 파트너들과 협력하고 있습니다.",
    "약속": "저희는 AI 기술과 최고 전문가 네트워크의 독보적인 융합을 통해 가치 '평가'를 넘어 가치 '향상'으로 이끄는 실질적인 솔루션을 제공하며, 기업 가치 성장을 위한 최적의 파트너가 될 것을 약속드립니다."
};
const defaultUnknownAnswer = `문의하신 내용에 대한 답변은 현재 준비되어 있지 않습니다. 더 자세한 정보나 궁금한 점이 있으시면, ${YOUR_CONTACT_EMAIL} 로 문의 내용을 보내주시면 정성껏 답변드리겠습니다. 감사합니다.`;

// --- 초기화 ---
function initialize() {
    // 비디오 로드 함수 사용
    loadVideo(IDLE_AVATAR_VIDEO_SRC);

    // FAQ 버튼 생성
    const faqKeywords = {
        "회사 소개": "회사소개",
        "주요 사업": "주요사업",
        "핵심 역량": "핵심역량",
        "컨설팅 비용": "컨설팅비용",
        "개발 경험": "개발경험",
        "문의하기": "문의"
    };

    Object.entries(faqKeywords).forEach(([buttonText, keyword]) => {
        const button = document.createElement('button');
        button.className = 'faq-btn';
        button.textContent = buttonText;
        button.dataset.question = keyword;
        faqButtonsContainer.appendChild(button);
    });
    
    // mp3 파일 미리 로드
    console.log("오디오 파일 미리 로드 중...");
    for (const [key, path] of Object.entries(prerecordedAudio)) {
        const audio = new Audio();
        audio.src = path;
        audio.preload = 'auto';
        
        // 로드 상태 확인 (선택사항)
        audio.addEventListener('canplaythrough', () => {
            console.log(`${path} 로드 완료`);
        }, { once: true });
        
        // 오류 발생 시 대비
        audio.addEventListener('error', (e) => {
            console.error(`${path} 로드 실패:`, e);
        }, { once: true });
    }
    
    addFaqButtonListeners();
}

// 비디오 로드 함수
function loadVideo(videoSrc) {
    const videoElement = document.getElementById('avatarVideo');
    const sourceElement = document.getElementById('videoSource');
    
    // 비디오 로딩 전 이벤트 리스너 설정
    videoElement.addEventListener('error', function(e) {
        console.error('Video error:', e);
        console.error('Error code:', videoElement.error ? videoElement.error.code : 'unknown');
    }, { once: true });
    
    // 비디오 소스 설정
    sourceElement.src = videoSrc;
    videoElement.load(); // 변경된 소스로 비디오 다시 로드
    
    // 비디오 재생 시도
    const playPromise = videoElement.play();
    if (playPromise !== undefined) {
        playPromise
            .then(() => console.log('Video playback started successfully'))
            .catch(err => {
                console.warn('Video playback was prevented:', err);
                // 자동 재생 실패 시 사용자에게 재생 버튼 표시 등의 대체 방안 구현
            });
    }
}

// --- 이벤트 리스너 설정 ---
askButton.addEventListener('click', handleQuestion);
questionInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleQuestion();
    }
});

// FAQ 버튼 리스너 함수
function addFaqButtonListeners() {
    document.querySelectorAll('.faq-btn').forEach(button => {
        button.addEventListener('click', () => {
            const questionKeyword = button.dataset.question;
            console.log("FAQ 버튼 클릭:", questionKeyword);
            
            // FAQ 버튼 클릭 시 직접 오디오 경로 전달
            if (prerecordedAudio[questionKeyword]) {
                const answer = answerMap[questionKeyword] || defaultUnknownAnswer;
                speakWithAudio(answer, prerecordedAudio[questionKeyword]);
            } else {
                findAndSpeakAnswer(questionKeyword, true);
            }
        });
    });
}

// --- 핵심 로직 ---
function handleQuestion() {
    const question = questionInput.value.trim();
    if (question) {
        findAndSpeakAnswer(question);
        questionInput.value = '';
    } else {
        speak("죄송합니다. 질문을 입력해주세요.", true);
    }
}

// 유사 질문 처리를 위한 함수
function findAndSpeakAnswer(questionText, isFaqClick = false) {
    let answer = null;
    let bestMatchScore = 0;
    let bestMatchKeyword = null;
    const lowerQuestion = questionText.toLowerCase();

    // 1. FAQ 버튼 클릭인 경우 직접 매핑
    if (isFaqClick && answerMap[questionText]) {
        answer = answerMap[questionText];
        bestMatchKeyword = questionText; // FAQ 버튼 클릭 시 키워드 저장
    } else {
        // 2. 정확한 키워드 매칭 시도
        for (const keyword in answerMap) {
            if (lowerQuestion.includes(keyword.toLowerCase())) {
                answer = answerMap[keyword];
                bestMatchKeyword = keyword; // 정확한 매칭 시 키워드 저장
                bestMatchScore = 1;
                break;
            }
        }
        
        // 3. 정확한 매칭이 없을 경우 유사도 검사
        if (!answer) {
            // 각 키워드에 대한 유사도 점수 계산
            for (const keyword in answerMap) {
                const keywordParts = keyword.toLowerCase().split(/\s+/); // 공백으로 분리
                let matchedParts = 0;
                
                // 키워드의 각 부분이 질문에 포함되어 있는지 확인
                for (const part of keywordParts) {
                    if (part.length > 2 && lowerQuestion.includes(part)) { // 2글자 이상인 부분만 체크
                        matchedParts++;
                    }
                }
                
                // 매칭 점수 계산 (매칭된 부분 / 총 부분)
                const score = keywordParts.length > 0 ? matchedParts / keywordParts.length : 0;
                
                // 동의어 처리 (유사어 점수 추가)
                const synonymScore = calculateSynonymScore(lowerQuestion, keyword.toLowerCase());
                const totalScore = score + synonymScore;
                
                // 가장 높은 점수의 매칭 찾기
                if (totalScore > bestMatchScore && totalScore > 0.3) { // 30% 이상 일치하는 경우만
                    bestMatchScore = totalScore;
                    bestMatchKeyword = keyword;
                }
            }
            
            // 충분히 높은 점수가 있으면 답변 선택
            if (bestMatchKeyword && bestMatchScore > 0.3) {
                answer = answerMap[bestMatchKeyword];
                console.log(`유사 질문 매칭: "${questionText}" -> "${bestMatchKeyword}" (점수: ${bestMatchScore.toFixed(2)})`);
            }
        }
    }
    
    // 특별 케이스 처리
    if (questionText === "문의") { 
        answer = defaultUnknownAnswer;
        bestMatchKeyword = "문의";
    }

    if (answer) {
        // 매칭된 키워드가 오디오 파일이 있는 FAQ 항목인지 확인
        if (bestMatchKeyword && prerecordedAudio[bestMatchKeyword]) {
            // FAQ 항목에 해당하면 오디오 파일 사용
            speakWithAudio(answer, prerecordedAudio[bestMatchKeyword]);
        } else {
            // FAQ 항목이 아니면 일반 TTS 사용
            speak(answer);
        }
    } else {
        // 답변이 없으면 문의 오디오 사용
        speakWithAudio(defaultUnknownAnswer, prerecordedAudio["문의"]);
    }
}

// 동의어/유사어 처리 함수 (계속)
function calculateSynonymScore(question, keyword) {
    // 동의어 사전 (FAQ 항목 중심으로 축소)
    const synonyms = {
        "회사": ["기업", "법인", "조직", "단체", "스톤", "stone", "에이아이스톤", "ai stone"],
        "소개": ["안내", "설명", "알려", "어떤", "뭐하는", "무엇을"],
        "주요": ["핵심", "중요", "메인", "주된", "중심"],
        "사업": ["비즈니스", "서비스", "일", "하는 일"],
        "역량": ["능력", "경쟁력", "실력", "스킬"],
        "개발": ["프로그래밍", "코딩", "제작", "구현"],
        "경험": ["노하우", "실적", "경력", "해본 것"],
        "컨설팅": ["상담", "자문", "컨설턴트", "consulting"],
        "비용": ["가격", "요금", "금액", "얼마", "페이", "지불", "비용", "가격"],
        "문의": ["질문", "연락", "contact", "물어볼 것", "알려줘"]
    };
    
    let score = 0;
    
    // 키워드에 포함된 동의어 찾기
    for (const [key, synonymList] of Object.entries(synonyms)) {
        if (keyword.includes(key)) {
            // 질문에 동의어가 있는지 확인
            for (const synonym of synonymList) {
                if (question.includes(synonym)) {
                    score += 0.3; // 동의어 발견 시 점수 추가
                    break;
                }
            }
        }
    }
    
    return score;
}

// 오디오 파일로 말하기 함수
function speakWithAudio(textToSpeak, audioPath) {
    answerTextElement.textContent = textToSpeak;
    speechBubble.classList.add('visible');
    
    // 이미 재생 중인 오디오 중지
    if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio = null;
    }
    
    // 말하는 비디오로 전환
    loadVideo(SPEAKING_AVATAR_VIDEO_SRC);
    
    // 오디오 재생
    const audio = new Audio(audioPath);
    window.currentAudio = audio;
    
    audio.onplay = () => {
        console.log("Audio started playing:", audioPath);
    };
    
    audio.onended = () => {
        console.log("Audio playback ended");
        // 대기 영상으로 다시 전환
        loadVideo(IDLE_AVATAR_VIDEO_SRC);
        window.currentAudio = null;
    };
    
    audio.onerror = (error) => {
        console.error(`Audio playback error with ${audioPath}:`, error);
        console.error(`Error code: ${audio.error ? audio.error.code : 'unknown'}`);
        // 오류 시 기존 TTS로 폴백
        speak(textToSpeak);
    };
    
    // 오디오 재생 시도
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.error("Audio playback failed:", error);
            // 자동 재생 정책으로 인한 오류 등 처리
            speak(textToSpeak);
        });
    }
}

// TTS로 말하기 함수 (기존 함수)
function speak(textToSpeak, isErrorOrInfo = false) {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }

    answerTextElement.textContent = textToSpeak;
    speechBubble.classList.add('visible');

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ko-KR';
    
    // 한국어 음성 찾기 시도
    const voices = speechSynthesis.getVoices();
    const koreanVoice = voices.find(voice => 
        voice.lang.includes('ko') && (voice.name.includes('Premium') || voice.name.includes('Natural'))
    );
    
    if (koreanVoice) {
        utterance.voice = koreanVoice;
    }
    
    // 약간 자연스러운 속도와 피치 조정
    utterance.rate = 0.9;  // 약간 느리게
    utterance.pitch = 1.0;

    utterance.onstart = () => {
        console.log("Speech started");
        loadVideo(SPEAKING_AVATAR_VIDEO_SRC);
    };

    utterance.onend = () => {
        console.log("Speech ended");
        loadVideo(IDLE_AVATAR_VIDEO_SRC);
    };

    utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
        answerTextElement.textContent = "죄송합니다, 음성을 재생하는 데 문제가 발생했습니다. 브라우저 설정을 확인해주세요.";
        speechBubble.classList.add('visible');
        // 에러 발생 시에도 대기 영상으로 돌림
        loadVideo(IDLE_AVATAR_VIDEO_SRC);
    };
    
    speechSynthesis.speak(utterance);
}

// DOMContentLoaded 이벤트 리스너
document.addEventListener('DOMContentLoaded', initialize);