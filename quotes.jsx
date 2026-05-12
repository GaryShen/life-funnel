// Bilingual reflective quotes — rotated through in the main panel.
// 100 entries spanning Stoics, Chinese classics, Zen, modern writers,
// and anonymous proverbs. Auto-cycled by app.jsx every ~9 s.
const QUOTES = [
  {
    zh: "我們並非死亡剝奪人的時間，而是揮霍時間的人讓自己短促。",
    en: "It is not that we have a short time to live, but that we waste much of it.",
    attr: "Seneca · 塞內卡",
  },
  {
    zh: "記住你終將一死。",
    en: "Memento mori — remember that you will die.",
    attr: "Stoic Maxim · 斯多葛箴言",
  },
  {
    zh: "你怎麼度過一天，就怎麼度過一生。",
    en: "How we spend our days is how we spend our lives.",
    attr: "Annie Dillard · 安妮・迪勒",
  },
  {
    zh: "時間是構成生命的材料。",
    en: "Time is the substance of which life is made.",
    attr: "Benjamin Franklin · 富蘭克林",
  },
  {
    zh: "今天就是你曾經害怕的明天。",
    en: "Today is the tomorrow you worried about yesterday.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "活著的時候要熱烈地活著，因為時間有限。",
    en: "Live deliberately — your hours are finite, and falling.",
    attr: "Thoreau, paraphrased · 梭羅",
  },
  {
    zh: "我們所擁有的，唯有當下。",
    en: "All we have is this present moment.",
    attr: "Marcus Aurelius · 馬可・奧理略",
  },
  {
    zh: "別讓「明天再說」吃掉了你所有的明天。",
    en: "Do not let 'someday' devour all your tomorrows.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "生命的長度不能延展，但密度可以。",
    en: "You cannot stretch the length of your life — only its density.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "凡走過的，皆無法重來；凡未走的，仍有可能。",
    en: "What is past cannot be relived; what is left can still be lived.",
    attr: "Anonymous · 佚名",
  },

  // — Stoics & ancient Greeks —
  {
    zh: "當我們遲疑時，生命已疾馳而過。",
    en: "While we are postponing, life speeds by.",
    attr: "Seneca · 塞內卡",
  },
  {
    zh: "你此刻就可能離開人世——讓這念頭決定你所做、所言、所思。",
    en: "You could leave life right now. Let that determine what you do and say and think.",
    attr: "Marcus Aurelius · 馬可・奧理略",
  },
  {
    zh: "先決定你要成為什麼樣的人，然後去做該做的事。",
    en: "First say to yourself what you would be; then do what you have to do.",
    attr: "Epictetus · 愛比克泰德",
  },
  {
    zh: "死亡與我們無涉——我們在時死亡不在，死亡來時我們不在。",
    en: "Death is nothing to us: while we exist, death is not present; when death is present, we no longer exist.",
    attr: "Epicurus · 伊比鳩魯",
  },
  {
    zh: "未經審視的人生，不值得活。",
    en: "The unexamined life is not worth living.",
    attr: "Socrates · 蘇格拉底",
  },
  {
    zh: "最偉大的勝利，是戰勝自己。",
    en: "The first and greatest victory is to conquer yourself.",
    attr: "Plato · 柏拉圖",
  },
  {
    zh: "認識自己，是一切智慧的起點。",
    en: "Knowing yourself is the beginning of all wisdom.",
    attr: "Aristotle · 亞里斯多德",
  },
  {
    zh: "無人能兩次踏進同一條河。",
    en: "No man ever steps in the same river twice.",
    attr: "Heraclitus · 赫拉克利特",
  },
  {
    zh: "人之所以悲苦，不在於擁有太少，而在於渴望太多。",
    en: "It is not the man who has too little, but the man who craves more, that is poor.",
    attr: "Seneca · 塞內卡",
  },
  {
    zh: "把握今日，盡量少信任明日。",
    en: "Carpe diem — seize the day, trusting little to tomorrow.",
    attr: "Horace · 賀拉斯",
  },
  {
    zh: "最好的日子，是最早逃離我們的。",
    en: "The best days are the first to flee.",
    attr: "Virgil · 維吉爾",
  },

  // — Chinese classics: Confucian / Daoist / Buddhist roots —
  {
    zh: "逝者如斯夫，不舍晝夜。",
    en: "It flows on like this, never ceasing day or night.",
    attr: "孔子 · Confucius",
  },
  {
    zh: "未知生，焉知死。",
    en: "Not yet understanding life — how can we know death?",
    attr: "孔子 · Confucius",
  },
  {
    zh: "吾生也有涯，而知也無涯。",
    en: "Our life has its bounds, but knowledge has none.",
    attr: "莊子 · Zhuangzi",
  },
  {
    zh: "方生方死，方死方生。",
    en: "Just as one is born, one begins to die; just as one dies, one begins to be born.",
    attr: "莊子 · Zhuangzi",
  },
  {
    zh: "合抱之木，生於毫末；千里之行，始於足下。",
    en: "A tree the breadth of an embrace grows from a tiny shoot; a thousand-mile journey begins beneath one's feet.",
    attr: "老子 · Laozi",
  },
  {
    zh: "知人者智，自知者明。",
    en: "He who knows others is clever; he who knows himself is enlightened.",
    attr: "老子 · Laozi",
  },
  {
    zh: "盛年不重來，一日難再晨。",
    en: "The prime years come not back; a day knows but one dawn.",
    attr: "陶淵明 · Tao Yuanming",
  },
  {
    zh: "夫天地者，萬物之逆旅；光陰者，百代之過客。",
    en: "Heaven and earth are an inn for all things; time, a traveler passing through a hundred generations.",
    attr: "李白 · Li Bai",
  },
  {
    zh: "人生到處知何似，應似飛鴻踏雪泥。",
    en: "What is human life like? A wild goose pressing prints on snow.",
    attr: "蘇軾 · Su Shi",
  },
  {
    zh: "人生如逆旅，我亦是行人。",
    en: "Life is an inn one passes through; I, too, am only a traveller.",
    attr: "蘇軾 · Su Shi",
  },
  {
    zh: "人生不相見，動如參與商。",
    en: "Lives meet so seldom — we drift like the dawn and evening stars.",
    attr: "杜甫 · Du Fu",
  },
  {
    zh: "死生亦大矣，豈不痛哉。",
    en: "Life and death are weighty matters indeed — how can one not grieve?",
    attr: "王羲之 · Wang Xizhi",
  },
  {
    zh: "黑髮不知勤學早，白首方悔讀書遲。",
    en: "While young, one knows not to study soon; with white hair, one regrets reading too late.",
    attr: "顏真卿 · Yan Zhenqing",
  },
  {
    zh: "少年易老學難成，一寸光陰不可輕。",
    en: "Youth fades fast and learning comes hard — do not take an inch of time lightly.",
    attr: "朱熹 · Zhu Xi",
  },
  {
    zh: "莫等閒，白了少年頭，空悲切。",
    en: "Do not idle — youth's dark hair turns white, and only sorrow remains.",
    attr: "岳飛 · Yue Fei",
  },
  {
    zh: "明日復明日，明日何其多；我生待明日，萬事成蹉跎。",
    en: "Tomorrow, then tomorrow — how many tomorrows are there? Living always for tomorrow, all undertakings come to naught.",
    attr: "文嘉 · Wen Jia",
  },
  {
    zh: "無可奈何花落去，似曾相識燕歸來。",
    en: "Helplessly the blossoms fall; familiar swallows return again.",
    attr: "晏殊 · Yan Shu",
  },
  {
    zh: "破山中賊易，破心中賊難。",
    en: "It is easy to conquer thieves in the mountains; harder still to conquer the thief within the heart.",
    attr: "王陽明 · Wang Yangming",
  },
  {
    zh: "知是行之始，行是知之成。",
    en: "Knowing is the beginning of doing; doing is the completion of knowing.",
    attr: "王陽明 · Wang Yangming",
  },
  {
    zh: "樹欲靜而風不止，子欲養而親不待。",
    en: "The tree longs for stillness, but the wind will not cease; the child longs to repay the parent, who waits no more.",
    attr: "漢樂府 · Han Yuefu",
  },
  {
    zh: "一寸光陰一寸金，寸金難買寸光陰。",
    en: "An inch of time is an inch of gold; but an inch of gold cannot buy an inch of time.",
    attr: "中國諺語 · Chinese Proverb",
  },
  {
    zh: "春有百花秋有月，夏有涼風冬有雪；若無閒事掛心頭，便是人間好時節。",
    en: "Spring has flowers, autumn has the moon; summer has cool winds, winter has snow. If no idle worries hang on the heart, every season is a good season.",
    attr: "無門慧開 · Wumen Huikai",
  },
  {
    zh: "此身難得，今已得；人命易失，今易失。",
    en: "Human life is hard to obtain — and easy to lose.",
    attr: "佛家偈 · Buddhist Verse",
  },
  {
    zh: "無常迅速，當念無常。",
    en: "Impermanence is swift — be ever mindful of it.",
    attr: "佛家偈 · Buddhist Verse",
  },
  {
    zh: "人生最確定的，唯有兩件：終將死去，與不知何時死去。",
    en: "Two things are certain: that we will die, and that we do not know when.",
    attr: "Tibetan Buddhism · 藏傳佛教",
  },
  {
    zh: "光陰疾於矢，生命脆若朝露。",
    en: "Time flies swifter than an arrow; life is more fleeting than morning dew.",
    attr: "道元 · Dōgen",
  },
  {
    zh: "歲月旅人也，去者來者皆為過客。",
    en: "The months and days are eternal travellers; those that come and go are pilgrims too.",
    attr: "松尾芭蕉 · Bashō",
  },
  {
    zh: "現在這一刻，是你所擁有的唯一時刻。",
    en: "The present moment is the only moment available to us.",
    attr: "Thich Nhat Hanh · 一行禪師",
  },
  {
    zh: "過去已逝，未來未至；唯有當下，是清醒的居所。",
    en: "Do not dwell in the past, do not dream of the future. Concentrate the mind on the present moment.",
    attr: "Buddha · 釋迦牟尼",
  },

  // — Modern writers, philosophers, and observers —
  {
    zh: "死並非生的對立面，而是生的一部分。",
    en: "Death is not the opposite of life, but a part of it.",
    attr: "村上春樹 · Murakami",
  },
  {
    zh: "向死而生，方能存在。",
    en: "Being toward death — only then does one truly exist.",
    attr: "Heidegger · 海德格",
  },
  {
    zh: "生命須往前活，卻只能回望才能理解。",
    en: "Life can only be understood backwards, but it must be lived forwards.",
    attr: "Kierkegaard · 齊克果",
  },
  {
    zh: "時間是構成我的物質。它是河，而我是水。",
    en: "Time is the substance I am made of. Time is a river — and that river is me.",
    attr: "Borges · 波赫士",
  },
  {
    zh: "我犯下人能犯的最大的罪——我不快樂。",
    en: "I have committed the worst of sins one can commit: I have not been happy.",
    attr: "Borges · 波赫士",
  },
  {
    zh: "人應當想像薛西弗斯是快樂的。",
    en: "One must imagine Sisyphus happy.",
    attr: "Camus · 卡繆",
  },
  {
    zh: "在嚴冬的深處，我終於明白自己內心有一個不可戰勝的夏天。",
    en: "In the depth of winter, I finally learned there was within me an invincible summer.",
    attr: "Camus · 卡繆",
  },
  {
    zh: "人即其選擇之總和。",
    en: "A person is the sum of their choices.",
    attr: "Sartre · 沙特",
  },
  {
    zh: "人類所有的不幸，源於不能安靜地獨坐房中。",
    en: "All of humanity's problems stem from man's inability to sit quietly in a room alone.",
    attr: "Pascal · 帕斯卡",
  },
  {
    zh: "最重要的時刻，是現在；最重要的人，是眼前的人。",
    en: "The most important time is now; the most important person is the one before you.",
    attr: "Tolstoy · 托爾斯泰",
  },
  {
    zh: "人們害怕死亡，正如孩子害怕黑暗。",
    en: "Men fear death as children fear to go in the dark.",
    attr: "Francis Bacon · 培根",
  },
  {
    zh: "昨日的我聰明，故而欲改變世界；今日的我智慧，故而改變自己。",
    en: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.",
    attr: "Rumi · 魯米",
  },
  {
    zh: "生與死本為一體，正如河流與大海本為一體。",
    en: "Life and death are one, even as the river and the sea are one.",
    attr: "Kahlil Gibran · 紀伯倫",
  },
  {
    zh: "你是怎麼破產的？兩種方式——先是漸漸地，然後突然。",
    en: "How did you go bankrupt? Two ways — gradually, then suddenly.",
    attr: "Hemingway · 海明威",
  },
  {
    zh: "人們會忘記你說過的話，但永遠記得你帶給他們的感受。",
    en: "People will forget what you said, but they will never forget how you made them feel.",
    attr: "Maya Angelou · 瑪雅・安傑盧",
  },
  {
    zh: "能決定的，是如何運用所被賜予的時間。",
    en: "All we have to decide is what to do with the time that is given us.",
    attr: "J.R.R. Tolkien · 托爾金",
  },
  {
    zh: "人生中最重要的兩天：出生的那天，與發現為何而生的那天。",
    en: "The two most important days in your life are the day you are born and the day you find out why.",
    attr: "Mark Twain · 馬克・吐溫",
  },
  {
    zh: "你的人生屬於你，別讓它被無聲擊垮。",
    en: "Your life is your life. Don't let it be clubbed into dank submission.",
    attr: "Bukowski · 布考斯基",
  },
  {
    zh: "無法回到過去並改寫開頭，但你可以從此處開始改寫結局。",
    en: "You can't go back and change the beginning, but you can start where you are and change the ending.",
    attr: "C.S. Lewis · 路易斯",
  },
  {
    zh: "結束每一天，與它告別；你已盡力。",
    en: "Finish each day and be done with it. You have done what you could.",
    attr: "Emerson · 愛默生",
  },
  {
    zh: "不能利用今天的人，明天亦不能利用。",
    en: "He who cannot use today, will not use tomorrow either.",
    attr: "Goethe · 歌德",
  },
  {
    zh: "當你忙於計劃時，生活已悄然發生。",
    en: "Life is what happens to you while you're busy making other plans.",
    attr: "John Lennon · 約翰・藍儂",
  },
  {
    zh: "告訴我，你打算如何度過這狂野而珍貴的一生？",
    en: "Tell me, what is it you plan to do with your one wild and precious life?",
    attr: "Mary Oliver · 瑪麗・奧利佛",
  },
  {
    zh: "死亡是生命最佳的發明。它清理舊有的，為新生讓位。",
    en: "Death is very likely the single best invention of life — it clears out the old to make way for the new.",
    attr: "Steve Jobs · 賈伯斯",
  },
  {
    zh: "記住自己即將死去，是我做過最重要的決定的工具。",
    en: "Remembering that I'll be dead soon is the most important tool I've ever encountered to make the big choices in life.",
    attr: "Steve Jobs · 賈伯斯",
  },
  {
    zh: "人生唯一無法委派他人的，是時間。",
    en: "The only thing you cannot delegate is your time.",
    attr: "Naval Ravikant · 納瓦爾",
  },
  {
    zh: "在這匆忙的世代，緩慢是一種抵抗。",
    en: "In an age of acceleration, nothing can be more exhilarating than going slow.",
    attr: "Pico Iyer · 皮科・艾耶",
  },
  {
    zh: "人生有三件要事：第一是仁慈，第二是仁慈，第三仍是仁慈。",
    en: "Three things in human life are important: the first is to be kind; the second is to be kind; the third is to be kind.",
    attr: "Henry James · 亨利・詹姆斯",
  },
  {
    zh: "臨終者最常後悔的是：但願我曾鼓起勇氣，活出自己的人生。",
    en: "The most common deathbed regret: I wish I'd had the courage to live a life true to myself.",
    attr: "Bronnie Ware · 邦妮・韋爾",
  },
  {
    zh: "他們常說：但願當初我沒這麼努力工作。",
    en: "They often say: I wish I hadn't worked so hard.",
    attr: "Bronnie Ware · 邦妮・韋爾",
  },

  // — Anonymous, proverbs, distilled reflections —
  {
    zh: "時間不在乎你願不願意，它只是流走。",
    en: "Time does not care if you are ready — it leaves anyway.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "我們從未真正擁有時間——只是借來一場揮霍。",
    en: "We never truly own time — we only borrow it, and spend it.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "最忙碌的人，往往最沒有時間活著。",
    en: "The busiest people are often the ones with the least time to live.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "死亡並不可怕，可怕的是從未活過。",
    en: "Death is not the tragedy — never having truly lived is.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "你今天浪費的，是你未來無人能再給予的。",
    en: "What you waste today, no one can give back to you tomorrow.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "擁有的時間越少，每一秒就越珍貴。",
    en: "The less time you have, the more precious each second becomes.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "我們以為來日方長，其實已是夕陽西下。",
    en: "We assume the day is long — yet already the sun slips west.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "忙著賺錢的時候，生活已從指縫間溜走。",
    en: "While we are busy earning a living, life slips between our fingers.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "黃昏的鐘聲提醒：你今天又老了一日。",
    en: "The evening bell reminds you: today, you have aged one more day.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "你以為的「日後再說」，其實多半成了「再也沒有」。",
    en: "What you call 'later' often turns into 'never.'",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "不必懼怕死亡——只要怕辜負每一個尚未死的清晨。",
    en: "Fear not death — fear the mornings you let pass unlived.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "「等到有空」，從來不會自己到來。",
    en: "'When I have time' never arrives on its own.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "不必擔心走得慢，要擔心是否在原地。",
    en: "Do not fear moving slowly — fear standing still.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "歲月不饒人，亦不被人饒。",
    en: "Years spare no one, and no one spares them.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "最好的時節是十年前，其次，是現在。",
    en: "The best time was ten years ago. The second best time is now.",
    attr: "中國諺語 · Chinese Proverb",
  },
  {
    zh: "世間最公平之事——每人一日皆為二十四時。",
    en: "The most fair thing in the world: everyone gets twenty-four hours a day.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "真正的悲劇不是死亡，而是死亡前已停止生長。",
    en: "The real tragedy is not death — it is to stop growing long before it.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "每一個現在，都是過去眾多選擇的結果。",
    en: "Every present moment is the consequence of countless past choices.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "不要假裝你還有很多時間。",
    en: "Do not pretend you have all the time in the world.",
    attr: "Anonymous · 佚名",
  },
  {
    zh: "漏沙的每一粒，都是不可贖回的禮物。",
    en: "Every grain that falls is a gift you cannot redeem.",
    attr: "Anonymous · 佚名",
  },
];

window.QUOTES = QUOTES;
