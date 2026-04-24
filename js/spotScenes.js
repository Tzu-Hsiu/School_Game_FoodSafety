/**
 * spotScenes.js — Data structure for "Spot the Hazard" scenes
 * Includes categories, difficulty, variants, and enhanced educational content.
 */

'use strict';

const SPOT_CATEGORIES = [
  { id: 'night_market', name: '夜市', emoji: '🌃' },
  { id: 'school', name: '校園周邊', emoji: '🏫' },
  { id: 'kitchen', name: '家庭廚房', emoji: '🍳' },
  { id: 'restaurant', name: '餐廳', emoji: '🍽️' },
  { id: 'supermarket', name: '超市', emoji: '🛒' }
];

const SPOT_SCENES = [
  /* ----------------------------------------------------------
     SCENE 1 — 補習班便當店備餐區 (Category: School, Easy)
     ---------------------------------------------------------- */
  {
    id: 'school_1',
    categoryId: 'school',
    difficulty: 'easy',
    emoji: '🏫',
    title: '補習班便當店',
    subtitle: 'Bento Counter',
    context: '提示：找出畫面中有問題的地方！',
    completeTip: '這幾個問題在台灣外食攤位上非常常見，記住了就等於每天多一層保護。',
    timeLimit: 40,
    variants: [
      {
        image: 'images/scene1_bento.png',
        hazardCount: 4,
        hotspots: [
          {
            id: 101, x: 25, y: 90, r: 12,
            badge: '⚠️ 生熟同板', name: '砧板區',
            detail: '切完生雞肉，同一塊砧板直接放上白飯',
            verdict: '⚠️ 交叉污染！',
            explain: '生雞肉含有沙門氏菌與彎曲桿菌。同一砧板切生肉再放熟飯，細菌直接轉移至熟食。',
            severity: 'high',
            realCase: '2018年某便當店因砧板未分開，導致50名學生集體食物中毒。',
            tip: '應各自使用專屬砧板並以顏色區分（例如：紅生肉、綠蔬菜、黃熟食）。'
          },
          {
            id: 102, x: 48, y: 80, r: 15,
            badge: '⚠️ 夾具混用', name: '夾具架',
            detail: '夾過生肉的夾子，直接夾旁邊的熟食或共用',
            verdict: '⚠️ 交叉污染！',
            explain: '用夾過生肉的夾子直接夾熟食，是台灣外食交叉污染的頭號原因。',
            severity: 'high',
            realCase: '常見於自助餐或滷味攤，一夾到底引發急性腸胃炎。',
            tip: '不同食材應配備各自專屬的夾具，並定時清洗。'
          },
          {
            id: 103, x: 20, y: 44, r: 16,
            badge: '⚠️ 超時暴露', name: '食物展示區',
            detail: '便當無遮蓋，已放置 3 小時（時鐘顯示），且有蒼蠅',
            verdict: '⚠️ 超過安全時限！',
            explain: '熟食在 15–60°C 環境中放超過 2 小時，就會大量增殖並產生耐熱毒素。',
            severity: 'medium',
            realCase: '常見便當放至下午當點心吃，導致仙人掌桿菌中毒。',
            tip: '買來後應盡速食用，超過2小時未吃完請冷藏或丟棄。'
          },
          {
            id: 104, x: 35, y: 55, r: 12,
            badge: '⚠️ 徒手備餐', name: '備餐人員',
            detail: '未戴手套，用手直接拿取食物裝盒',
            verdict: '⚠️ 手部污染風險！',
            explain: '人的雙手帶有金黃色葡萄球菌，傷口、皮膚問題者菌量更多。',
            severity: 'medium',
            realCase: '廚工手部有傷口仍處理飯糰，造成多人上吐下瀉。',
            tip: '備餐全程應戴手套或使用清潔的夾具，手有傷口不可直接接觸即食食物。'
          }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     SCENE 2 — 夜市飲料攤 (Category: Night Market, Medium)
     ---------------------------------------------------------- */
  {
    id: 'night_market_1',
    categoryId: 'night_market',
    difficulty: 'medium',
    emoji: '🌃',
    title: '夜市飲料攤',
    subtitle: 'Night Market Drink Stall',
    context: '提示：找出畫面中有問題的地方！',
    completeTip: '夜市飲料攤的冰品和手部衛生是最大的風險點，學會判斷就能安全喝好料。',
    timeLimit: 35,
    variants: [
      {
        image: 'images/scene2_nightmarket.png',
        hazardCount: 4,
        hotspots: [
          {
            id: 201, x: 27, y: 90, r: 12,
            badge: '⚠️ 冰桶置地', name: '製冰區',
            detail: '裝冰塊的大桶直接放在地面，半開蓋',
            verdict: '⚠️ 冰塊污染風險！',
            explain: '地面排水溝含有大量病原。冰塊桶置地，容易被積水飛濺污染。',
            severity: 'high',
            realCase: '夏季常見冰品大腸桿菌群超標，多為冰塊或水源污染。',
            tip: '冰塊容器應架高存放並隨時加蓋，冰鏟不可直接放在冰塊堆上。'
          },
          {
            id: 202, x: 31, y: 56, r: 12,
            badge: '⚠️ 配料開放', name: '配料吧台',
            detail: '珍珠等配料全部開蓋放室溫，蒼蠅在飛',
            verdict: '⚠️ 配料暴露污染！',
            explain: '戶外環境飛蟲多，開放配料是細菌的派對場地。',
            severity: 'medium',
            realCase: '蒼蠅腳上帶有多種病原菌，短暫停留即可能造成腸胃炎傳播。',
            tip: '配料區應有防塵罩或紗窗防護，並盡量保持冷藏狀態。'
          },
          {
            id: 203, x: 52, y: 46, r: 10,
            badge: '⚠️ 摸錢備料', name: '收銀/備料區',
            detail: '手握鈔票，同時另一手直接碰觸飲料杯',
            verdict: '⚠️ 手部交叉污染！',
            explain: '鈔票與硬幣含有多種病原體。收款後未洗手就備料，細菌直接污染飲料。',
            severity: 'medium',
            realCase: '常見夜市攤販一人身兼多職，錢幣上的金黃色葡萄球菌轉移至食物。',
            tip: '應有專人負責收銀，或備料人員在接觸錢幣後必須洗手才能碰觸食物。'
          },
          {
            id: 204, x: 63, y: 75, r: 15,
            badge: '⚠️ 髒抹布', name: '清潔區',
            detail: '吧台上一條明顯很髒的濕抹布',
            verdict: '⚠️ 抹布二次污染！',
            explain: '髒抹布是細菌的超級培養皿，抹過桌面等於把細菌均勻塗抹開來。',
            severity: 'high',
            realCase: '研究發現，餐飲業未勤換的抹布上，生菌數可高達數十億。',
            tip: '應使用拋棄式紙巾，或準備多條抹布頻繁消毒替換。'
          }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     SCENE 3 — 學校廚房備餐區 (Category: School, Hard)
     ---------------------------------------------------------- */
  {
    id: 'school_2',
    categoryId: 'school',
    difficulty: 'hard',
    emoji: '🍳',
    title: '學校廚房備餐區',
    subtitle: 'School Kitchen Prep Area',
    context: '提示：找出畫面中有問題的地方！',
    completeTip: '學校廚房是大規模食物製備環境，一個疏忽可能讓全班中毒！',
    timeLimit: 30,
    variants: [
      {
        image: 'images/scene3_kitchen.png',
        hazardCount: 4,
        hotspots: [
          {
            id: 301, x: 18, y: 75, r: 15,
            badge: '⚠️ 蛋殼污染', name: '煎蛋站',
            detail: '打蛋時蛋殼碎片掉出，可能落入熟食',
            verdict: '⚠️ 沙門氏菌污染！',
            explain: '沙門氏菌大量存在於蛋殼表面。打蛋時若不慎，極易造成二次污染。',
            severity: 'high',
            realCase: '2021年某國中因未徹底清洗蛋殼，導致大規模沙門氏菌感染。',
            tip: '打蛋前應確保蛋殼清潔，並避免蛋殼碎片落入容器。'
          },
          {
            id: 302, x: 50, y: 90, r: 12,
            badge: '⚠️ 生熟同砧板', name: '切配台',
            detail: '生豬肉與蔬菜在同一塊綠色砧板上',
            verdict: '⚠️ 交叉污染！',
            explain: '未分類的砧板是交叉污染的溫床。',
            severity: 'high',
            realCase: '常因貪圖方便，用切過生肉的砧板切水果，導致集體中毒。',
            tip: '應確實執行砧板顏色管理（紅肉、藍海鮮、綠蔬菜、黃熟食）。'
          },
          {
            id: 303, x: 50, y: 12, r: 12,
            badge: '⚠️ 粿條室溫', name: '備料架',
            detail: '打開的濕粿條放室溫，時鐘顯示已超過2小時',
            verdict: '⚠️ 米酵菌酸風險！',
            explain: '濕粿條在室溫下超過2小時，可能產生致死率極高的米酵菌酸。',
            severity: 'high',
            realCase: '2024年寶林茶室事件即因保存不當產生米酵菌酸，造成嚴重死傷。',
            tip: '濕澱粉製品（如粿條、河粉）應全程冷藏，並注意保存期限。'
          },
          {
            id: 304, x: 84, y: 27, r: 15,
            badge: '⚠️ 生熟交叉', name: '冷藏室',
            detail: '冰箱上層生蝦汁液滴落到下層熟食區',
            verdict: '⚠️ 腸炎弧菌污染！',
            explain: '生海鮮的汁液常帶有腸炎弧菌或諾羅病毒。',
            severity: 'medium',
            realCase: '冰箱未落實分層管理，下層的涼拌菜被上層生鮮汁液滴到。',
            tip: '冰箱儲存鐵則：熟食放上層、生食放下層，並妥善加蓋密封。'
          }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     SCENE 4 — 家庭廚房冰箱 (Category: Kitchen, Easy)
     ---------------------------------------------------------- */
  {
    id: 'kitchen_1',
    categoryId: 'kitchen',
    difficulty: 'easy',
    emoji: '🧊',
    title: '家庭冰箱危機',
    subtitle: 'Home Refrigerator',
    context: '提示：找出冰箱存放的問題！',
    completeTip: '冰箱不是保險箱！正確的存放位置能大大降低交叉污染風險。',
    timeLimit: 35,
    variants: [
      {
        image: 'images/scene_placeholder_kitchen1.png',
        hazardCount: 3,
        hotspots: [
          {
            id: 401, x: 30, y: 20, r: 12,
            badge: '⚠️ 門邊放鮮奶', name: '冰箱門邊',
            detail: '鮮奶放在溫度最不穩定的冰箱門邊',
            verdict: '⚠️ 溫度變化導致變質！',
            explain: '冰箱門開開關關，溫度變化大，不適合放易腐壞的鮮奶。',
            severity: 'low',
            realCase: '夏天常因鮮奶存放在門邊導致提早酸敗。',
            tip: '鮮奶應放置在冰箱內部溫度穩定的冷藏層。'
          },
          {
            id: 402, x: 60, y: 40, r: 15,
            badge: '⚠️ 生肉放上層', name: '冷藏上層',
            detail: '解凍中的生肉放在最上層，且無深盤盛裝',
            verdict: '⚠️ 血水滴落風險！',
            explain: '生肉血水滴落會污染下方食物。',
            severity: 'high',
            realCase: '生肉血水滴落至下方剩菜，隔天微波不夠熱導致腸胃炎。',
            tip: '解凍生肉應放在最底層，並用深盤或保鮮盒盛裝。'
          },
          {
            id: 403, x: 50, y: 80, r: 12,
            badge: '⚠️ 熟食未加蓋', name: '冷藏中層',
            detail: '昨天的剩菜連盤子直接放進冰箱，無保鮮膜',
            verdict: '⚠️ 異味與污染！',
            explain: '未加蓋食物容易吸附異味，且水份流失，更可能被其他物品污染。',
            severity: 'medium',
            realCase: '冰箱異味的主要來源，且容易交叉污染。',
            tip: '熟食進冰箱前務必使用保鮮膜或保鮮盒密封。'
          }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     SCENE 5 — 餐廳自助吧 (Category: Restaurant, Medium)
     ---------------------------------------------------------- */
  {
    id: 'restaurant_1',
    categoryId: 'restaurant',
    difficulty: 'medium',
    emoji: '🍽️',
    title: '吃到飽自助吧',
    subtitle: 'Buffet Salad Bar',
    context: '提示：找出自助吧台的衛生隱憂！',
    completeTip: '自助吧是大家共用的空間，飛沫和公筷母匙是關鍵。',
    timeLimit: 30,
    variants: [
      {
        image: 'images/scene_placeholder_restaurant1.png',
        hazardCount: 3,
        hotspots: [
          {
            id: 501, x: 40, y: 30, r: 15,
            badge: '⚠️ 無防飛沫罩', name: '沙拉吧',
            detail: '沙拉吧上方完全沒有玻璃防護罩',
            verdict: '⚠️ 飛沫污染！',
            explain: '客人取餐時交談、咳嗽，飛沫直接落入食物中。',
            severity: 'medium',
            realCase: '未設飛沫罩的自助吧是諾羅病毒傳染的高風險區域。',
            tip: '自助吧應設置適當高度的防飛沫玻璃罩（Sneeze guard）。'
          },
          {
            id: 502, x: 70, y: 60, r: 12,
            badge: '⚠️ 夾子掉入食物', name: '熱食區',
            detail: '公用夾子的握柄整個掉進菜餚裡',
            verdict: '⚠️ 手部細菌轉移！',
            explain: '幾十個人摸過的夾子握把掉進菜裡，等於把大家的細菌拌進去。',
            severity: 'high',
            realCase: '常見於自助餐，顧客手部未清潔觸摸夾子，造成金黃色葡萄球菌污染。',
            tip: '夾子應有專屬放置處，若掉入食物中應請服務生更換整盤菜與夾子。'
          },
          {
            id: 503, x: 20, y: 70, r: 12,
            badge: '⚠️ 溫水泡冰勺', name: '冰淇淋區',
            detail: '挖冰淇淋的勺子泡在混濁且非流動的水中',
            verdict: '⚠️ 細菌培養皿！',
            explain: '非流動的水在室溫下，加上冰淇淋的糖分，是細菌完美培養基。',
            severity: 'medium',
            realCase: '衛生局抽檢常發現冰淇淋挖勺水生菌數嚴重超標。',
            tip: '冰勺應放置於流動活水槽中，或定期由服務生清洗更換。'
          }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     SCENE 6 — 超市生鮮區 (Category: Supermarket, Easy)
     ---------------------------------------------------------- */
  {
    id: 'supermarket_1',
    categoryId: 'supermarket',
    difficulty: 'easy',
    emoji: '🛒',
    title: '超市生鮮冷藏櫃',
    subtitle: 'Supermarket Chill Area',
    context: '提示：買菜時你也該注意的細節！',
    completeTip: '超市採買有順序，冷鍊中斷是最大的風險。',
    timeLimit: 40,
    variants: [
      {
        image: 'images/scene_placeholder_supermarket1.png',
        hazardCount: 3,
        hotspots: [
          {
            id: 601, x: 50, y: 50, r: 15,
            badge: '⚠️ 超出保存線', name: '冷藏櫃',
            detail: '商品堆疊過高，超過了冷藏櫃內部的紅色安全線(Load Line)',
            verdict: '⚠️ 冷卻不足！',
            explain: '超過安全線的商品無法得到足夠的冷空氣循環，容易變質。',
            severity: 'low',
            realCase: '夏季開放式冷藏櫃上層商品溫度常高達10度以上，導致鮮奶酸敗。',
            tip: '選購時盡量拿取安全線以下或較內側的商品。'
          },
          {
            id: 602, x: 80, y: 80, r: 12,
            badge: '⚠️ 購物車順序', name: '顧客推車',
            detail: '推車裡先放了冷凍水餃和鮮奶，才準備去逛日用品區',
            verdict: '⚠️ 冷鍊中斷！',
            explain: '生鮮食品應在結帳前最後拿取，避免在室溫下回溫解凍。',
            severity: 'medium',
            realCase: '採買時間過長，冷凍食品解凍再放回冰箱，影響品質並滋生細菌。',
            tip: '採買順序：乾貨日用品 → 蔬菜水果 → 魚肉類生鮮 → 冷凍食品。'
          },
          {
            id: 603, x: 20, y: 30, r: 10,
            badge: '⚠️ 包裝破損', name: '真空包裝肉品',
            detail: '真空包裝已經膨脹變形',
            verdict: '⚠️ 微生物發酵！',
            explain: '真空包裝膨脹（胖包）代表內部已有細菌生長產生氣體。',
            severity: 'high',
            realCase: '誤食膨脹包裝食品導致肉毒桿菌等中毒風險。',
            tip: '購買前仔細檢查包裝完整度，發現膨脹或漏氣絕不可購買。'
          }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     SCENE 7 — 夜市燒烤攤 (Category: Night Market, Hard)
     ---------------------------------------------------------- */
  {
    id: 'night_market_2',
    categoryId: 'night_market',
    difficulty: 'hard',
    emoji: '🍢',
    title: '夜市燒烤攤',
    subtitle: 'BBQ Stall',
    context: '提示：香噴噴的烤肉背後藏著什麼危機？',
    completeTip: '燒烤類要注意生熟分離與是否熟透。',
    timeLimit: 25,
    variants: [
      {
        image: 'images/scene_placeholder_nightmarket2.png',
        hazardCount: 3,
        hotspots: [
          {
            id: 701, x: 30, y: 70, r: 12,
            badge: '⚠️ 刷醬混用', name: '醬料區',
            detail: '同一支刷子刷生肉，又直接刷快烤好的熟肉',
            verdict: '⚠️ 交叉污染！',
            explain: '刷過生肉的刷子沾滿細菌，再刷熟肉等於把細菌又塗回去。',
            severity: 'high',
            realCase: '夜市燒烤攤最常發生的盲點，導致沙門氏菌等腸胃炎。',
            tip: '生肉與熟食應使用不同的刷子與醬料盆。'
          },
          {
            id: 702, x: 60, y: 40, r: 10,
            badge: '⚠️ 雞肉帶血', name: '烤架上',
            detail: '烤雞肉串表面微焦，但骨邊肉仍帶有明顯血水',
            verdict: '⚠️ 未徹底加熱！',
            explain: '禽肉必須完全熟透（中心溫度75度以上）才能殺死沙門氏菌和彎曲桿菌。',
            severity: 'high',
            realCase: '外焦內生的雞肉串是引發嚴重食物中毒的常見原因。',
            tip: '食用帶骨雞肉前先檢查骨邊是否無血水。'
          },
          {
            id: 703, x: 80, y: 80, r: 15,
            badge: '⚠️ 滴血水', name: '生食陳列區',
            detail: '上層擺放生肉串的盤子，血水滴到下方的蔬菜串上',
            verdict: '⚠️ 交叉污染！',
            explain: '蔬菜通常烤的時間較短甚至可生食，若被生肉血水污染極度危險。',
            severity: 'medium',
            realCase: '生熟食材未分層擺放，血水滴落造成廣泛污染。',
            tip: '生鮮肉類應與蔬菜類分開陳列，或將肉類放下層。'
          }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     SCENE 8 — 學校合作社 (Category: School, Easy)
     ---------------------------------------------------------- */
  {
    id: 'school_3',
    categoryId: 'school',
    difficulty: 'easy',
    emoji: '🏪',
    title: '學校福利社',
    subtitle: 'School Tuck Shop',
    context: '提示：下課買點心也有要注意的事！',
    completeTip: '包裝食品要注意標示，熟食則要注意保溫狀態。',
    timeLimit: 30,
    variants: [
      {
        image: 'images/scene_placeholder_school3.png',
        hazardCount: 3,
        hotspots: [
          {
            id: 801, x: 40, y: 60, r: 12,
            badge: '⚠️ 保溫箱不熱', name: '熱狗機/包子機',
            detail: '保溫箱溫度顯示只有40度',
            verdict: '⚠️ 危險溫度帶！',
            explain: '熱食保溫必須高於60度。40度是細菌最喜歡的繁殖溫度。',
            severity: 'medium',
            realCase: '便利商店或合作社保溫設備故障未察覺，導致食物變質。',
            tip: '購買熱食時留意保溫設備是否有足夠溫度。'
          },
          {
            id: 802, x: 70, y: 30, r: 10,
            badge: '⚠️ 標示不清', name: '散裝餅乾區',
            detail: '分裝的餅乾袋上沒有任何有效期限和成分標示',
            verdict: '⚠️ 資訊不明！',
            explain: '散裝食品也必須有明確的效期標示，否則無法得知是否過期。',
            severity: 'low',
            realCase: '吃下過期劣變的零食導致腸胃不適。',
            tip: '拒絕購買無標示、來路不明的散裝食品。'
          },
          {
            id: 803, x: 20, y: 80, r: 12,
            badge: '⚠️ 陽光直射', name: '飲料區',
            detail: '寶特瓶飲料長時間被窗外的陽光直射',
            verdict: '⚠️ 變質風險！',
            explain: '陽光曝曬會導致塑膠瓶釋出物質，且加速內容物變質。',
            severity: 'low',
            realCase: '果汁或茶飲因高溫曝曬變味酸敗。',
            tip: '存放應避免陽光直射與高溫環境。'
          }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     SCENE 9 — 家庭砧板清潔 (Category: Kitchen, Medium)
     ---------------------------------------------------------- */
  {
    id: 'kitchen_2',
    categoryId: 'kitchen',
    difficulty: 'medium',
    emoji: '🔪',
    title: '洗碗槽與砧板',
    subtitle: 'Kitchen Sink',
    context: '提示：廚房水槽裡的隱形殺手！',
    completeTip: '清潔用具若沒保養好，反而會變成散播細菌的幫兇。',
    timeLimit: 30,
    variants: [
      {
        image: 'images/scene_placeholder_kitchen2.png',
        hazardCount: 3,
        hotspots: [
          {
            id: 901, x: 50, y: 50, r: 15,
            badge: '⚠️ 萬年菜瓜布', name: '洗碗槽',
            detail: '菜瓜布破爛發黑，且泡在積水的水槽邊',
            verdict: '⚠️ 細菌大本營！',
            explain: '潮濕的菜瓜布生菌數比馬桶還高，用它洗碗等於把細菌塗在碗上。',
            severity: 'high',
            realCase: '研究證實廚房海綿/菜瓜布是居家最髒的物品之一。',
            tip: '菜瓜布使用後應擰乾懸掛，且至少每個月更換一次。'
          },
          {
            id: 902, x: 30, y: 30, r: 12,
            badge: '⚠️ 木砧板發霉', name: '砧板架',
            detail: '木質砧板表面有深色發霉的刀痕',
            verdict: '⚠️ 黴菌毒素！',
            explain: '發霉的砧板可能產生黃麴毒素等，洗不掉也切不乾淨。',
            severity: 'high',
            realCase: '長期使用發霉的竹/木砧板，微量黴菌毒素進入體內傷肝。',
            tip: '木砧板用完須洗淨立起風乾，若有發霉黑斑應即刻汰換。'
          },
          {
            id: 903, x: 70, y: 70, r: 12,
            badge: '⚠️ 洗生肉水花', name: '水龍頭下',
            detail: '直接在水槽大水沖洗生雞肉，水花四濺到旁邊的乾淨碗盤',
            verdict: '⚠️ 擴散污染！',
            explain: '沖洗生雞肉會讓含有沙門氏菌的水滴飛濺半徑達50公分以上。',
            severity: 'medium',
            realCase: '歐美多國已呼籲不要在水槽直接沖洗生禽肉。',
            tip: '生肉用紙巾擦拭即可，若真要洗應放水盆中輕洗，避免水花飛濺。'
          }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     SCENE 10 — 超市熟食區 (Category: Supermarket, Medium)
     ---------------------------------------------------------- */
  {
    id: 'supermarket_2',
    categoryId: 'supermarket',
    difficulty: 'medium',
    emoji: '🍱',
    title: '超市熟食與便當區',
    subtitle: 'Deli Section',
    context: '提示：買打折便當要注意什麼？',
    completeTip: '熟食區的重點在於溫度控制和夾具衛生。',
    timeLimit: 30,
    variants: [
      {
        image: 'images/scene_placeholder_supermarket2.png',
        hazardCount: 3,
        hotspots: [
          {
            id: 1001, x: 40, y: 40, r: 12,
            badge: '⚠️ 熟食無蓋', name: '炸物保溫盤',
            detail: '炸雞腿和可樂餅完全開放放置，無任何遮蔽',
            verdict: '⚠️ 飛沫與灰塵污染！',
            explain: '顧客說話的飛沫或走動揚起的灰塵會落在食物上。',
            severity: 'medium',
            realCase: '開放式熟食常成為細菌或病毒散播的途徑。',
            tip: '應選擇有加蓋或裝在盒子裡的熟食。'
          },
          {
            id: 1002, x: 70, y: 30, r: 10,
            badge: '⚠️ 夾子共用', name: '熟食夾具',
            detail: '用來夾生菜沙拉的夾子，被拿去夾旁邊的炸豬排',
            verdict: '⚠️ 交叉混味/污染！',
            explain: '不同屬性的食物（尤其生食與熟食）混用夾子會造成污染。',
            severity: 'low',
            realCase: '生菜可能帶有土壤菌，沾染到熟豬排上。',
            tip: '每種熟食都應該有獨立的夾具。'
          },
          {
            id: 1003, x: 20, y: 70, r: 12,
            badge: '⚠️ 常溫放便當', name: '特價推車',
            detail: '打折的便當沒有放在保溫箱或冷藏櫃，直接放在走道的常溫推車上販售',
            verdict: '⚠️ 超時增菌風險！',
            explain: '常溫放置正是仙人掌桿菌最愛繁殖的環境。',
            severity: 'high',
            realCase: '買了常溫放置過久的便當，吃下肚引發急性嘔吐。',
            tip: '購買便當應確認是熱存（>60度）或冷藏保存（<7度）。'
          }
        ]
      }
    ]
  }
];

window.SPOT_CATEGORIES = SPOT_CATEGORIES;
window.SPOT_SCENES = SPOT_SCENES;
