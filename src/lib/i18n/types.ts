export type Locale = "vi" | "en";

export const DEFAULT_LOCALE: Locale = "vi";
export const LOCALES: Locale[] = ["vi", "en"];
export const LOCALE_COOKIE = "locale";

export type TranslationValues = Record<string, string | number>;

export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    elearning: string;
    games: string;
    math: string;
    leaderboard: string;
    login: string;
    logout: string;
  };
  common: {
    backHome: string;
    backGames: string;
    points: string;
    level: string;
    explore: string;
    products: string;
    tapToView: string;
    scrollDown: string;
    loading: string;
    you: string;
    loginToSave: string;
    scoreSaved: string;
    savingScore: string;
    fullscreen: string;
    exitFullscreen: string;
    exitGame: string;
    playAgain: string;
    chooseOtherLevel: string;
  };
  home: {
    family: string;
    heroTitle1: string;
    heroTitle2: string;
    heroDesc: string;
    ctaMath: string;
    ctaChess: string;
    categories: string;
    categoriesDesc: string;
    featuredBook: string;
    featuredTitle: string;
    featuredDesc: string;
    footer: string;
    beachAlt: string;
  };
  login: {
    subtitle: string;
    username: string;
    password: string;
    usernamePlaceholder: string;
    submit: string;
    submitting: string;
    error: string;
    optional: string;
  };
  leaderboard: {
    title: string;
    subtitle: string;
    loginCta: string;
    backMath: string;
    quizzesDone: string;
    empty: string;
  };
  math: {
    bookName: string;
    title: string;
    desc: string;
    gradeLabel: string;
    questionsPerGrade: string;
    questionsPerSession: string;
    startPractice: string;
    leaderboard: string;
    chooseGrade: string;
    invalidGrade: string;
    questionBank: string;
    feature1: string;
    feature2: string;
    feature3: string;
    startQuiz: string;
    loadError: string;
    fetchError: string;
    answerAll: string;
    submit: string;
    submitting: string;
    questionOf: string;
    prev: string;
    next: string;
    noResult: string;
    backPractice: string;
    resultTitle: string;
    scoreThisQuiz: string;
    correctAnswers: string;
    accuracy: string;
    totalScore: string;
    scoreNotSaved: string;
    loginLink: string;
    scoreNotSavedDesc: string;
    detailTitle: string;
    questionN: string;
    youChose: string;
    correctAnswer: string;
    newQuiz: string;
    otherGrade: string;
    backQuiz: string;
    retry: string;
    submitFail: string;
    submitFailed: string;
    loadingQuestions: string;
    answeredProgress: string;
    nextQuestion: string;
  };
  categories: {
    elearning: { title: string; subtitle: string };
    games: { title: string; subtitle: string };
  };
  items: {
    "on-tap-toan": { title: string; description: string; tags: string[] };
    "co-vua": { title: string; description: string; tags: string[] };
    sudoku: { title: string; description: string; tags: string[] };
  };
  chess: {
    title: string;
    subtitle: string;
    familyGames: string;
    menuDesc: string;
    yourTurn: string;
    computerThinking: string;
    youCheck: string;
    computerCheck: string;
    win: string;
    lose: string;
    draw: string;
    winTitle: string;
    loseTitle: string;
    drawTitle: string;
    levels: Array<{ label: string; description: string }>;
  };
  sudoku: {
    title: string;
    subtitle: string;
    familyGames: string;
    menuDesc: string;
    fillHint: string;
    continueFill: string;
    wrongCells: string;
    winTitle: string;
    clear: string;
    complete: string;
    levels: Array<{ label: string; description: string }>;
  };
  tags: Record<string, string>;
};

export type Translator = (
  key: string,
  values?: TranslationValues
) => string;
