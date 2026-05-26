import type { SupportedLanguage } from "@/types/preferences";

export type I18nDictionary = {
  common: {
    auto: string;
    light: string;
    dark: string;
    language: string;
    theme: string;
    english: string;
    japanese: string;
    chineseSimplified: string;
    save: string;
    saving: string;
    cancel: string;
    status: string;
    dashboard: string;
    workspace: string;
    focus: string;
    break: string;
    running: string;
    paused: string;
    logout: string;
    hello: string;
    preferences: string;
    preferencesDescription: string;
    pomodoro: string;
    notes: string;
    friends: string;
    todo: string;
    daily: string;
    previous: string;
    next: string;
  };
  signIn: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    forgotPassword: string;
    submit: string;
    submitting: string;
    google: string;
    googleLoading: string;
    noAccount: string;
    signUp: string;
    or: string;
    signInError: string;
    googleError: string;
  };
  signUp: {
    backToSignIn: string;
    title: string;
    subtitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    createPassword: string;
    confirmYourPassword: string;
    submit: string;
    submitting: string;
    passwordMismatch: string;
    createError: string;
    hidePassword: string;
    showPassword: string;
  };
  profile: {
    pageTitle: string;
    title: string;
    subtitle: string;
    uploadImage: string;
    useCamera: string;
    capturePhoto: string;
    closeCamera: string;
    zoom: string;
    saveAvatar: string;
    reset: string;
    savingAvatar: string;
    currentAvatarAlt: string;
  };
  notes: {
    placeholder: string;
  };
  landing: {
    brand: string;
    headlineA: string;
    headlineB: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    aboutLabel: string;
    featuresHeading: string;
    featureTitles: [string, string, string, string];
    featureDescriptions: [string, string, string, string];
  };
  friendsSection: {
    listTab: string;
    searchTab: string;
    requestsTab: string;
    navAriaLabel: string;
    listTitle: string;
    listDescription: string;
    loadFriendsError: string;
    loadingFriends: string;
    noFriends: string;
    onlineNow: string;
    lastOnlineNever: string;
    lastOnlineMinute: string;
    lastOnlineHour: string;
    lastOnlineDay: string;
    showing: string;
    of: string;
    openChatWith: string;
    searchTitle: string;
    searchDescription: string;
    searchPlaceholder: string;
    searchAria: string;
    searching: string;
    noSearchResults: string;
    sendRequest: string;
    requested: string;
    friend: string;
    blockedYou: string;
    pending: string;
    unblock: string;
    block: string;
    searchError: string;
    blockError: string;
    actionError: string;
    requestsTitle: string;
    requestsDescription: string;
    loadingRequests: string;
    incoming: string;
    outgoing: string;
    noIncoming: string;
    noOutgoing: string;
    requestedAt: string;
    sentAt: string;
    pendingBadge: string;
    requestsError: string;
    requestActionError: string;
    accept: string;
    decline: string;
    acceptRequestTitle: string;
    declineRequestTitle: string;
    blockUserTitle: string;
    acceptRequestDescription: string;
    declineRequestDescription: string;
    blockUserDescription: string;
    conversationMissing: string;
    loadingConversation: string;
    conversationError: string;
    directConversation: string;
    loadOlder: string;
    noMessages: string;
    startConversation: string;
    typeMessage: string;
    send: string;
    sending: string;
    loadOlderError: string;
  };
  pomodoroSection: {
    title: string;
    subtitle: string;
    phaseFocus: string;
    phaseBreak: string;
    focusTimeBadge: string;
    breakTimeBadge: string;
    noTimerSelected: string;
    pause: string;
    continue: string;
    skipToBreak: string;
    skipToFocus: string;
    timerType: string;
    selectTimerType: string;
    addTimerType: string;
    addDialogTitle: string;
    addDialogDescription: string;
    timerName: string;
    timerNamePlaceholder: string;
    focusMins: string;
    breakMins: string;
    savingTimer: string;
    addTimerTypeError: string;
    settingsTitle: string;
    settingsDescription: string;
    autoStartBreak: string;
    autoStartBreakDescription: string;
    autoStartPomodoros: string;
    autoStartPomodorosDescription: string;
    timerTypeNames: {
        default: string,
        longFocus: string,
        deepWork: string,
        deepProductivity: string,
        ultraFocus: string,
      },
  };
    dailySection: {
      title: string;
      subtitle: string;
      addTask: string;
      editTask: string;
      taskTitle: string;
      taskNotes: string;
      taskNotesPlaceholder: string;
      parentTask: string;
      noParent: string;
      dueTime: string;
      color: string;
      icon: string;
      colorPickerTitle: string;
      iconPickerTitle: string;
      emptyTitle: string;
      emptyDescription: string;
      incompleteCount: string;
      completedCount: string;
      totalCount: string;
      loading: string;
      error: string;
      deleteTask: string;
      defaultColor: string;
      defaultIcon: string;
      chooseTime: string;
      noTimeSelected: string;
      clearTime: string;
      timePickerTitle: string;
      hourLabel: string;
      minuteLabel: string;
      iconLabels: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ];
      resetHint: string;
    };
};

const dictionary: Record<SupportedLanguage, I18nDictionary> = {
  en: {
    common: {
      auto: "Auto",
      light: "Light",
      dark: "Dark",
      language: "Language",
      theme: "Theme",
      english: "English",
      japanese: "Japanese",
      chineseSimplified: "Chinese (Simplified)",
      save: "Save",
      saving: "Saving...",
      cancel: "Cancel",
      status: "Status",
      dashboard: "Dashboard",
      workspace: "Workspace",
      focus: "Focus",
      break: "Break",
      running: "Running",
      paused: "Paused",
      logout: "Logout",
      hello: "Hello",
      preferences: "Preferences",
      preferencesDescription: "Personalize theme and language for your workspace.",
      pomodoro: "Pomodoro",
      notes: "Notes",
      friends: "Friends",
      previous: "Previous",
      todo: "To Do",
      daily: "Daily List",
      next: "Next",
    },
    signIn: {
      title: "Sign In",
      subtitle: "Welcome back. Sign in to continue.",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot password?",
      submit: "Login",
      submitting: "Signing in...",
      google: "Sign In with Google",
      googleLoading: "Redirecting...",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
      or: "OR",
      signInError: "Unable to sign in. Please try again.",
      googleError: "Google sign-in failed. Please try again.",
    },
    signUp: {
      backToSignIn: "Back to Sign In",
      title: "Create Account",
      subtitle: "Sign up with your email and password.",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      createPassword: "Create a password",
      confirmYourPassword: "Confirm your password",
      submit: "Sign up",
      submitting: "Creating account...",
      passwordMismatch: "Passwords do not match.",
      createError: "Unable to create account. Please try again.",
      hidePassword: "Hide password",
      showPassword: "Show password",
    },
    profile: {
      pageTitle: "Profile picture",
      title: "Choose your profile photo",
      subtitle: "Upload or capture a photo, adjust the circle, then save.",
      uploadImage: "Upload image",
      useCamera: "Use camera",
      capturePhoto: "Capture photo",
      closeCamera: "Close camera",
      zoom: "Zoom",
      saveAvatar: "Save avatar",
      reset: "Reset",
      savingAvatar: "Saving...",
      currentAvatarAlt: "Current avatar",
    },
    notes: {
      placeholder: "Notes page is coming soon.",
    },
    landing: {
      brand: "Pomotomo",
      headlineA: "Stay connected with friends,",
      headlineB: "and make focus feel effortless.",
      subtitle:
        "A unified workspace for pomodoro, notes, tasks, and daily planning so studying and work feel lighter every day.",
      primaryCta: "Get Started",
      secondaryCta: "Explore Features",
      aboutLabel: "What is Pomotomo?",
      featuresHeading: "Features",
      featureTitles: [
        "Find your steady focus rhythm",
        "Solo work becomes easier to sustain",
        "Notes that keep your thinking flow",
        "Know your next task instantly",
      ],
      featureDescriptions: [
        "Switch between focus and breaks naturally so you can build consistent daily progress.",
        "Seeing your friends' momentum lowers the start barrier and supports your focus habit.",
        "Markdown and image notes help you capture and organize ideas without breaking concentration.",
        "Manage ToDo and Daily List in one flow so you can start work faster with less decision friction.",
      ],
    },
    friendsSection: {
      listTab: "Friends List",
      searchTab: "Search",
      requestsTab: "Requests",
      navAriaLabel: "Friends sections",
      listTitle: "Friends List",
      listDescription: "Online friends appear first. Start or continue chat from the right side.",
      loadFriendsError: "Unable to load your friends right now.",
      loadingFriends: "Loading friends...",
      noFriends: "No friends yet.",
      onlineNow: "Online now",
      lastOnlineNever: "Last online: never",
      lastOnlineMinute: "Last online: {{value}}m ago",
      lastOnlineHour: "Last online: {{value}}h ago",
      lastOnlineDay: "Last online: {{value}}d ago",
      showing: "Showing",
      of: "of",
      openChatWith: "Open chat with {{name}}",
      searchTitle: "Search",
      searchDescription: "Find users by name, then send request, block, or unblock.",
      searchPlaceholder: "Search by user name",
      searchAria: "Search users by name",
      searching: "Searching...",
      noSearchResults: "No users found for {{query}}.",
      sendRequest: "Send Request",
      requested: "Requested",
      friend: "Friend",
      blockedYou: "Blocked You",
      pending: "Pending",
      unblock: "Unblock",
      block: "Block",
      searchError: "Unable to search users right now.",
      blockError: "Unable to block user.",
      actionError: "Unable to perform action.",
      requestsTitle: "Requests",
      requestsDescription: "Review incoming and outgoing friend requests.",
      loadingRequests: "Loading requests...",
      incoming: "Incoming",
      outgoing: "Outgoing",
      noIncoming: "No incoming requests.",
      noOutgoing: "No outgoing requests.",
      requestedAt: "Requested at {{value}}",
      sentAt: "Sent at {{value}}",
      pendingBadge: "Pending",
      requestsError: "Unable to load friend requests right now.",
      requestActionError: "Unable to perform request action.",
      accept: "Accept",
      decline: "Decline",
      acceptRequestTitle: "Accept request?",
      declineRequestTitle: "Decline request?",
      blockUserTitle: "Block user?",
      acceptRequestDescription: "Accept friend request from {{name}}?",
      declineRequestDescription: "Decline friend request from {{name}}?",
      blockUserDescription: "Block {{name}}? You can unblock later from Search.",
      conversationMissing: "Conversation was not found.",
      loadingConversation: "Loading conversation...",
      conversationError: "Unable to load conversation.",
      directConversation: "Direct conversation",
      loadOlder: "Load older",
      noMessages: "No messages yet.",
      startConversation: "Start the conversation.",
      typeMessage: "Type a message...",
      send: "Send",
      sending: "Sending...",
      loadOlderError: "Unable to load older messages.",
    },
    pomodoroSection: {
      title: "Pomodoro Timer",
      subtitle: "Designed to keep you in flow with focus and break cycles.",
      phaseFocus: "Focus",
      phaseBreak: "Break",
      focusTimeBadge: "FOCUS TIME",
      breakTimeBadge: "BREAK TIME",
      noTimerSelected: "No timer selected",
      pause: "Pause",
      continue: "Continue",
      skipToBreak: "Skip to break",
      skipToFocus: "Skip to focus",
      timerType: "TIMER TYPE",
      selectTimerType: "Select a timer type",
      addTimerType: "Add timer type",
      addDialogTitle: "Add timer type",
      addDialogDescription: "Create your own focus and break rhythm.",
      timerName: "Name",
      timerNamePlaceholder: "e.g. Coding Sprint",
      focusMins: "Focus (mins)",
      breakMins: "Break (mins)",
      savingTimer: "Saving...",
      addTimerTypeError: "Unable to create timer type right now.",
      settingsTitle: "Timer Settings",
      settingsDescription: "Choose how each cycle should continue.",
      autoStartBreak: "Auto start break",
      autoStartBreakDescription: "Automatically start break when focus ends.",
      autoStartPomodoros: "Auto start pomodoros",
      autoStartPomodorosDescription: "Automatically start focus when break ends.",
      timerTypeNames: {
        default: "Default",
        longFocus: "Long Focus",
        deepWork: "Deep Work",
        deepProductivity: "Deep Productivity",
        ultraFocus: "Ultra Focus",
      },
    },
    dailySection: {
      title: "Daily List",
      subtitle: "Template your day with nested tasks that reset every morning.",
      addTask: "Add task",
      editTask: "Edit task",
      taskTitle: "Task title",
      taskNotes: "Notes",
      taskNotesPlaceholder: "Add a quick note, context, or reminder...",
      parentTask: "Parent task",
      noParent: "No parent",
      dueTime: "Before time",
      color: "Color",
      icon: "Icon",
      colorPickerTitle: "Pick a color",
      iconPickerTitle: "Pick an icon",
      emptyTitle: "No daily tasks yet",
      emptyDescription: "Click the plus button to create your first task, set a color, icon, and optional time.",
      incompleteCount: "Incomplete",
      completedCount: "Completed",
      totalCount: "Total",
      loading: "Loading your daily list...",
      error: "Unable to load the daily list.",
      deleteTask: "Delete task",
      defaultColor: "Blue",
      defaultIcon: "Document",
      chooseTime: "Choose time",
      noTimeSelected: "No time set",
      clearTime: "Clear time",
      timePickerTitle: "Pick a time",
      hourLabel: "Hour",
      minuteLabel: "Minute",
      iconLabels: [
        "Document",
        "Checklist",
        "Calendar",
        "Clock",
        "Todo",
        "Sparkles",
        "Book",
        "Briefcase",
        "Brain",
        "Goal",
        "Heart",
        "Lightbulb",
        "Clipboard",
        "Star",
        "Sun",
        "Moon",
        "Shield",
        "Target",
        "Rocket",
        "Flower",
        "Pine Tree",
        "Flame",
        "Bell",
        "Message",
        "Pencil",
        "Folder",
        "Archive",
        "Badge",
        "Check",
        "Wand",
      ],
      resetHint: "Tasks reset automatically at midnight.",
    },
  },
  ja: {
    common: {
      auto: "自動",
      light: "ライト",
      dark: "ダーク",
      language: "言語",
      theme: "テーマ",
      english: "英語",
      japanese: "日本語",
      chineseSimplified: "中国語（簡体字）",
      save: "保存",
      saving: "保存中...",
      cancel: "キャンセル",
      status: "ステータス",
      dashboard: "ダッシュボード",
      workspace: "ワークスペース",
      focus: "集中",
      break: "休憩",
      running: "実行中",
      paused: "一時停止",
      logout: "ログアウト",
      hello: "こんにちは",
      preferences: "設定",
      preferencesDescription: "テーマと言語をワークスペースに合わせて調整できます。",
      pomodoro: "ポモドーロ",
      notes: "ノート",
      friends: "フレンド",
      previous: "前へ",
      next: "次へ",
      todo: "ToDoリスト",
      daily: "日課",
    },
    signIn: {
      title: "サインイン",
      subtitle: "おかえりなさい。続けるにはサインインしてください。",
      email: "メールアドレス",
      password: "パスワード",
      forgotPassword: "パスワードをお忘れですか？",
      submit: "ログイン",
      submitting: "ログイン中...",
      google: "Googleでサインイン",
      googleLoading: "リダイレクト中...",
      noAccount: "アカウントをお持ちでないですか？",
      signUp: "新規登録",
      or: "または",
      signInError: "サインインできませんでした。もう一度お試しください。",
      googleError: "Googleサインインに失敗しました。もう一度お試しください。",
    },
    signUp: {
      backToSignIn: "サインインへ戻る",
      title: "アカウント作成",
      subtitle: "メールアドレスとパスワードで登録します。",
      email: "メールアドレス",
      password: "パスワード",
      confirmPassword: "パスワード確認",
      createPassword: "パスワードを作成",
      confirmYourPassword: "パスワードを再入力",
      submit: "登録",
      submitting: "作成中...",
      passwordMismatch: "パスワードが一致しません。",
      createError: "アカウントを作成できませんでした。もう一度お試しください。",
      hidePassword: "パスワードを隠す",
      showPassword: "パスワードを表示",
    },
    profile: {
      pageTitle: "プロフィール画像",
      title: "プロフィール写真を選択",
      subtitle: "写真をアップロードまたは撮影し、円形を調整して保存してください。",
      uploadImage: "画像をアップロード",
      useCamera: "カメラを使う",
      capturePhoto: "撮影する",
      closeCamera: "カメラを閉じる",
      zoom: "ズーム",
      saveAvatar: "保存する",
      reset: "リセット",
      savingAvatar: "保存中...",
      currentAvatarAlt: "現在のアバター",
    },
    notes: {
      placeholder: "ノート機能は近日公開予定です。",
    },
    landing: {
      brand: "Pomotomo ポモトモ",
      headlineA: "友達とつながりながら、",
      headlineB: "今日の集中を、もっと心地よく。",
      subtitle:
        "ポモドーロ、ノート、ToDo、Daily List をひとつにまとめて、勉強も仕事も軽やかに続けられる作業アプリ。",
      primaryCta: "今すぐはじめる",
      secondaryCta: "機能を見る",
      aboutLabel: "ポモトモとは？",
      featuresHeading: "Features",
      featureTitles: [
        "集中のリズムが、自然と整う",
        "ひとりの作業が、続けやすくなる",
        "ノートは、考える流れを止めない",
        "今日やることが、すぐ決まる",
      ],
      featureDescriptions: [
        "集中と休憩を心地よく切り替え。気合いに頼らず、毎日の作業ペースを安定させて、積み上げを続けられます。",
        "友達のがんばりが見えるだけで、着手のハードルは下がる。ほどよいつながりが、集中の習慣づくりを支えます。",
        "Markdown と画像に対応したノートで、メモから整理までスムーズ。あとから見返しても分かりやすく、実用的です。",
        "ToDo と Daily List を同じ流れで管理。次にやることの迷いが減って、作業に入るまでの時間を短くできます。",
      ],
    },
    friendsSection: {
      listTab: "フレンド一覧",
      searchTab: "検索",
      requestsTab: "リクエスト",
      navAriaLabel: "フレンドセクション",
      listTitle: "フレンド一覧",
      listDescription: "オンラインの友達が先に表示されます。右側からチャットを開始または再開できます。",
      loadFriendsError: "フレンド一覧を読み込めませんでした。",
      loadingFriends: "フレンドを読み込み中...",
      noFriends: "フレンドはまだいません。",
      onlineNow: "オンライン",
      lastOnlineNever: "最終オンライン: なし",
      lastOnlineMinute: "最終オンライン: {{value}}分前",
      lastOnlineHour: "最終オンライン: {{value}}時間前",
      lastOnlineDay: "最終オンライン: {{value}}日前",
      showing: "表示",
      of: "件中",
      openChatWith: "{{name}}とのチャットを開く",
      searchTitle: "検索",
      searchDescription: "名前でユーザーを探し、リクエスト送信・ブロック・解除を行えます。",
      searchPlaceholder: "ユーザー名で検索",
      searchAria: "ユーザー名で検索",
      searching: "検索中...",
      noSearchResults: "「{{query}}」に一致するユーザーが見つかりません。",
      sendRequest: "リクエスト送信",
      requested: "送信済み",
      friend: "フレンド",
      blockedYou: "相手にブロックされています",
      pending: "保留中",
      unblock: "ブロック解除",
      block: "ブロック",
      searchError: "ユーザー検索に失敗しました。",
      blockError: "ユーザーをブロックできませんでした。",
      actionError: "操作を実行できませんでした。",
      requestsTitle: "リクエスト",
      requestsDescription: "受信・送信したフレンドリクエストを確認します。",
      loadingRequests: "リクエストを読み込み中...",
      incoming: "受信",
      outgoing: "送信",
      noIncoming: "受信リクエストはありません。",
      noOutgoing: "送信リクエストはありません。",
      requestedAt: "リクエスト受信: {{value}}",
      sentAt: "送信: {{value}}",
      pendingBadge: "保留中",
      requestsError: "フレンドリクエストを読み込めませんでした。",
      requestActionError: "リクエスト操作に失敗しました。",
      accept: "承認",
      decline: "拒否",
      acceptRequestTitle: "リクエストを承認しますか？",
      declineRequestTitle: "リクエストを拒否しますか？",
      blockUserTitle: "このユーザーをブロックしますか？",
      acceptRequestDescription: "{{name}}さんからのフレンドリクエストを承認しますか？",
      declineRequestDescription: "{{name}}さんからのフレンドリクエストを拒否しますか？",
      blockUserDescription: "{{name}}さんをブロックしますか？後で検索画面から解除できます。",
      conversationMissing: "会話が見つかりませんでした。",
      loadingConversation: "会話を読み込み中...",
      conversationError: "会話を読み込めませんでした。",
      directConversation: "1対1チャット",
      loadOlder: "過去のメッセージを読む",
      noMessages: "メッセージはまだありません。",
      startConversation: "会話を始めましょう。",
      typeMessage: "メッセージを入力...",
      send: "送信",
      sending: "送信中...",
      loadOlderError: "過去メッセージを読み込めませんでした。",
    },
    pomodoroSection: {
      title: "ポモドーロタイマー",
      subtitle: "集中と休憩のサイクルで、作業フローを保てるよう設計されています。",
      phaseFocus: "集中",
      phaseBreak: "休憩",
      focusTimeBadge: "集中時間",
      breakTimeBadge: "休憩時間",
      noTimerSelected: "タイマーが選択されていません",
      pause: "一時停止",
      continue: "再開",
      skipToBreak: "休憩へスキップ",
      skipToFocus: "集中へスキップ",
      timerType: "タイマータイプ",
      selectTimerType: "タイマータイプを選択",
      addTimerType: "タイマータイプを追加",
      addDialogTitle: "タイマータイプ追加",
      addDialogDescription: "あなた好みの集中・休憩リズムを作成できます。",
      timerName: "名前",
      timerNamePlaceholder: "例: コーディングスプリント",
      focusMins: "集中 (分)",
      breakMins: "休憩 (分)",
      savingTimer: "保存中...",
      addTimerTypeError: "現在タイマータイプを作成できません。",
      settingsTitle: "タイマー設定",
      settingsDescription: "各サイクルの進行方法を選択してください。",
      autoStartBreak: "休憩を自動開始",
      autoStartBreakDescription: "集中が終了したら休憩を自動で開始します。",
      autoStartPomodoros: "集中を自動開始",
      autoStartPomodorosDescription: "休憩が終了したら集中を自動で開始します。",
      timerTypeNames: {
        default: "普通",
        longFocus: "ロングフォーカス",
        deepWork: "ディープワーク",
        deepProductivity: "高集中",
        ultraFocus: "ウルトラフォーカス",
      },
    },
    dailySection: {
      title: "日課リスト",
      subtitle: "毎朝リセットされる、親子構造のあるタスクテンプレートです。",
      addTask: "タスクを追加",
      editTask: "タスクを編集",
      taskTitle: "タスク名",
      taskNotes: "メモ",
      taskNotesPlaceholder: "補足やリマインダーを書きます...",
      parentTask: "親タスク",
      noParent: "親なし",
      dueTime: "期限時刻",
      color: "色",
      icon: "アイコン",
      colorPickerTitle: "色を選ぶ",
      iconPickerTitle: "アイコンを選ぶ",
      emptyTitle: "まだ日課がありません",
      emptyDescription: "＋ボタンから最初のタスクを作成して、色・アイコン・時刻を設定してください。",
      incompleteCount: "未完了",
      completedCount: "完了",
      totalCount: "合計",
      loading: "日課リストを読み込み中...",
      error: "日課リストを読み込めませんでした。",
      deleteTask: "タスクを削除",
      defaultColor: "青",
      defaultIcon: "書類",
      chooseTime: "時間を選ぶ",
      noTimeSelected: "時刻なし",
      clearTime: "時刻を消去",
      timePickerTitle: "時刻を選ぶ",
      hourLabel: "時",
      minuteLabel: "分",
      iconLabels: [
        "書類",
        "チェックリスト",
        "カレンダー",
        "時計",
        "ToDo",
        "きらめき",
        "本",
        "ブリーフケース",
        "ブレイン",
        "ゴール",
        "ハート",
        "電球",
        "クリップボード",
        "スター",
        "太陽",
        "月",
        "シールド",
        "ターゲット",
        "ロケット",
        "花",
        "松の木",
        "炎",
        "ベル",
        "メッセージ",
        "鉛筆",
        "フォルダ",
        "アーカイブ",
        "バッジ",
        "チェック",
        "ワンド",
      ],
      resetHint: "タスクは毎日0:00に自動でリセットされます。",
    },
  },
  "zh-CN": {
    common: {
      auto: "自动",
      light: "浅色",
      dark: "深色",
      language: "语言",
      theme: "主题",
      english: "英语",
      japanese: "日语",
      chineseSimplified: "简体中文",
      save: "保存",
      saving: "保存中...",
      cancel: "取消",
      status: "状态",
      dashboard: "仪表盘",
      workspace: "工作区",
      focus: "专注",
      break: "休息",
      running: "进行中",
      paused: "已暂停",
      logout: "登出",
      hello: "你好",
      preferences: "偏好设置",
      preferencesDescription: "自定义工作区的主题和语言。",
      pomodoro: "番茄钟",
      notes: "笔记",
      friends: "好友",
      previous: "上一页",
      next: "下一页",
      todo: "待办事项",
      daily: "日常清单",
    },
    signIn: {
      title: "登录",
      subtitle: "欢迎回来。请登录后继续。",
      email: "邮箱",
      password: "密码",
      forgotPassword: "忘记密码？",
      submit: "登录",
      submitting: "登录中...",
      google: "使用 Google 登录",
      googleLoading: "跳转中...",
      noAccount: "还没有账号？",
      signUp: "注册",
      or: "或",
      signInError: "无法登录，请重试。",
      googleError: "Google 登录失败，请重试。",
    },
    signUp: {
      backToSignIn: "返回登录",
      title: "创建账号",
      subtitle: "使用邮箱和密码注册。",
      email: "邮箱",
      password: "密码",
      confirmPassword: "确认密码",
      createPassword: "创建密码",
      confirmYourPassword: "再次输入密码",
      submit: "注册",
      submitting: "创建中...",
      passwordMismatch: "两次密码不一致。",
      createError: "无法创建账号，请重试。",
      hidePassword: "隐藏密码",
      showPassword: "显示密码",
    },
    profile: {
      pageTitle: "头像设置",
      title: "选择你的头像",
      subtitle: "上传或拍照，调整圆形区域后保存。",
      uploadImage: "上传图片",
      useCamera: "使用相机",
      capturePhoto: "拍照",
      closeCamera: "关闭相机",
      zoom: "缩放",
      saveAvatar: "保存头像",
      reset: "重置",
      savingAvatar: "保存中...",
      currentAvatarAlt: "当前头像",
    },
    notes: {
      placeholder: "笔记页面即将上线。",
    },
    landing: {
      brand: "Pomotomo",
      headlineA: "与朋友保持连接，",
      headlineB: "让专注更轻松自然。",
      subtitle: "把番茄钟、笔记、待办和日程整合在一起，让学习与工作每天更顺畅。",
      primaryCta: "立即开始",
      secondaryCta: "查看功能",
      aboutLabel: "什么是 Pomotomo？",
      featuresHeading: "功能",
      featureTitles: [
        "建立稳定的专注节奏",
        "独自工作也更容易坚持",
        "笔记不断思路",
        "立刻知道下一步要做什么",
      ],
      featureDescriptions: [
        "自然切换专注与休息，让日常进度更稳定。",
        "看到好友在努力，会降低开始门槛，帮助形成专注习惯。",
        "支持 Markdown 与图片的笔记，让记录与整理更顺畅。",
        "把 ToDo 与 Daily List 放在同一流程里，减少决策成本，更快进入状态。",
      ],
    },
    friendsSection: {
      listTab: "好友列表",
      searchTab: "搜索",
      requestsTab: "请求",
      navAriaLabel: "好友分区",
      listTitle: "好友列表",
      listDescription: "在线好友优先显示，可在右侧发起或继续聊天。",
      loadFriendsError: "暂时无法加载好友列表。",
      loadingFriends: "正在加载好友...",
      noFriends: "还没有好友。",
      onlineNow: "在线",
      lastOnlineNever: "最近在线：从未",
      lastOnlineMinute: "最近在线：{{value}}分钟前",
      lastOnlineHour: "最近在线：{{value}}小时前",
      lastOnlineDay: "最近在线：{{value}}天前",
      showing: "显示",
      of: "共",
      openChatWith: "与 {{name}} 聊天",
      searchTitle: "搜索",
      searchDescription: "按名称查找用户，并发送请求、拉黑或解除拉黑。",
      searchPlaceholder: "按用户名搜索",
      searchAria: "按用户名搜索用户",
      searching: "搜索中...",
      noSearchResults: "未找到与“{{query}}”相关的用户。",
      sendRequest: "发送请求",
      requested: "已请求",
      friend: "好友",
      blockedYou: "对方已拉黑你",
      pending: "待处理",
      unblock: "解除拉黑",
      block: "拉黑",
      searchError: "暂时无法搜索用户。",
      blockError: "无法拉黑用户。",
      actionError: "无法执行该操作。",
      requestsTitle: "请求",
      requestsDescription: "查看收到和发出的好友请求。",
      loadingRequests: "正在加载请求...",
      incoming: "收到的请求",
      outgoing: "发出的请求",
      noIncoming: "没有收到的请求。",
      noOutgoing: "没有发出的请求。",
      requestedAt: "请求时间：{{value}}",
      sentAt: "发送时间：{{value}}",
      pendingBadge: "待处理",
      requestsError: "暂时无法加载好友请求。",
      requestActionError: "无法执行请求操作。",
      accept: "同意",
      decline: "拒绝",
      acceptRequestTitle: "同意请求？",
      declineRequestTitle: "拒绝请求？",
      blockUserTitle: "拉黑用户？",
      acceptRequestDescription: "同意 {{name}} 的好友请求吗？",
      declineRequestDescription: "拒绝 {{name}} 的好友请求吗？",
      blockUserDescription: "要拉黑 {{name}} 吗？之后可在搜索页解除。",
      conversationMissing: "未找到该会话。",
      loadingConversation: "正在加载会话...",
      conversationError: "无法加载会话。",
      directConversation: "私聊会话",
      loadOlder: "加载更早消息",
      noMessages: "暂无消息。",
      startConversation: "开始聊天吧。",
      typeMessage: "输入消息...",
      send: "发送",
      sending: "发送中...",
      loadOlderError: "无法加载更早消息。",
    },
    pomodoroSection: {
      title: "番茄钟",
      subtitle: "通过专注与休息循环，帮助你保持工作流状态。",
      phaseFocus: "专注",
      phaseBreak: "休息",
      focusTimeBadge: "专注时间",
      breakTimeBadge: "休息时间",
      noTimerSelected: "尚未选择计时器",
      pause: "暂停",
      continue: "继续",
      skipToBreak: "跳到休息",
      skipToFocus: "跳到专注",
      timerType: "计时器类型",
      selectTimerType: "选择计时器类型",
      addTimerType: "添加计时器类型",
      addDialogTitle: "添加计时器类型",
      addDialogDescription: "创建你自己的专注与休息节奏。",
      timerName: "名称",
      timerNamePlaceholder: "例如：编码冲刺",
      focusMins: "专注（分钟）",
      breakMins: "休息（分钟）",
      savingTimer: "保存中...",
      addTimerTypeError: "暂时无法创建计时器类型。",
      settingsTitle: "计时器设置",
      settingsDescription: "选择每个循环的进行方式。",
      autoStartBreak: "自动开始休息",
      autoStartBreakDescription: "专注结束后自动进入休息。",
      autoStartPomodoros: "自动开始专注",
      autoStartPomodorosDescription: "休息结束后自动进入专注。",
      timerTypeNames: {
        default: "默认",
        longFocus: "长专注",
        deepWork: "深度工作",
        deepProductivity: "高效深度",
        ultraFocus: "超长专注",
      },
    },
    dailySection: {
      title: "日常清单",
      subtitle: "把你的日程做成带有嵌套结构的任务模板，每天清晨自动重置。",
      addTask: "添加任务",
      editTask: "编辑任务",
      taskTitle: "任务标题",
      taskNotes: "备注",
      taskNotesPlaceholder: "补充说明、上下文或提醒...",
      parentTask: "父任务",
      noParent: "无父任务",
      dueTime: "截止时间",
      color: "颜色",
      icon: "图标",
      colorPickerTitle: "选择颜色",
      iconPickerTitle: "选择图标",
      emptyTitle: "还没有日常任务",
      emptyDescription: "点击右上角的加号，创建第一条任务，并设置颜色、图标和可选时间。",
      incompleteCount: "未完成",
      completedCount: "已完成",
      totalCount: "总计",
      loading: "正在加载日常清单...",
      error: "无法加载日常清单。",
      deleteTask: "删除任务",
      defaultColor: "蓝色",
      defaultIcon: "文档",
      chooseTime: "选择时间",
      noTimeSelected: "未设置时间",
      clearTime: "清除时间",
      timePickerTitle: "选择时间",
      hourLabel: "小时",
      minuteLabel: "分钟",
      iconLabels: [
        "文档",
        "清单",
        "日历",
        "时钟",
        "待办",
        "闪光",
        "书本",
        "公文包",
        "大脑",
        "目标",
        "爱心",
        "灵感灯泡",
        "剪贴板",
        "星星",
        "太阳",
        "月亮",
        "盾牌",
        "靶心",
        "火箭",
        "花朵",
        "松树",
        "火焰",
        "铃铛",
        "消息",
        "铅笔",
        "文件夹",
        "归档",
        "徽章",
        "勾选",
        "魔杖",
      ],
      resetHint: "任务会在每天 00:00 自动重置。",
    },
  },
};

export const DEFAULT_DICTIONARY = dictionary.en;

export function getDictionary(language: SupportedLanguage): I18nDictionary {
  return dictionary[language] ?? DEFAULT_DICTIONARY;
}
