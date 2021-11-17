import React, { useState, useRef } from 'react';

export const legislatorItems = [
  {
    name: '臺北市第一選舉區（北投、士林）',
    legislators: [
      { name: '吳思瑤' }
    ]
  },
  {
    name: '臺北市第二選舉區（大同、士林）',
    legislators: [
      { name: '何志偉' }
    ]
  },
  {
    name: '臺北市第三選舉區（中山、松山）',
    legislators: [
      { name: '蔣萬安' }
    ]
  },
  {
    name: '臺北市第四選舉區（內湖、南港）',
    legislators: [
      { name: '高嘉瑜' }
    ]
  },
  {
    name: '臺北市第五選舉區（萬華、中正）',
    legislators: [
      { name: '林昶佐' }
    ]
  },
  {
    name: '臺北市第六選舉區（大安）',
    legislators: [
      { name: '林奕華' }
    ]
  },
  {
    name: '臺北市第七選舉區（信義、松山）',
    legislators: [
      { name: '費鴻泰' }
    ]
  },
  {
    name: '臺北市第八選舉區（文山、中正）',
    legislators: [
      { name: '賴士葆' }
    ]
  },
  {
    name: '新北市第一選舉區（石門、三芝、淡水、八里、林口、泰山）',
    legislators: [
      { name: '洪孟楷' }
    ]
  },
  {
    name: '新北市第二選舉區（五股、蘆洲、三重）',
    legislators: [
      { name: '林淑芬' }
    ]
  },
  {
    name: '新北市第三選舉區（三重）',
    legislators: [
      { name: '余天' }
    ]
  },
  {
    name: '新北市第四選舉區（新莊）',
    legislators: [
      { name: '吳秉叡' }
    ]
  },
  {
    name: '新北市第五選舉區（樹林、鶯歌、新莊）',
    legislators: [
      { name: '蘇巧慧' }
    ]
  },
  {
    name: '新北市第六選舉區（板橋）',
    legislators: [
      { name: '張宏陸' }
    ]
  },
  {
    name: '新北市第七選舉區（板橋）',
    legislators: [
      { name: '羅致政' }
    ]
  },
  {
    name: '新北市第八選舉區（中和）',
    legislators: [
      { name: '江永昌' }
    ]
  },
  {
    name: '新北市第九選舉區（永和、中和）',
    legislators: [
      { name: '林德福' }
    ]
  },
  {
    name: '新北市第十選舉區（土城、三峽）',
    legislators: [
      { name: '吳琪銘' }
    ]
  },
  {
    name: '新北市第十一選舉區（新店、深坑、石碇、坪林、烏來）',
    legislators: [
      { name: '羅明才' }
    ]
  },
  {
    name: '新北市第十二選舉區（金山、萬里、汐止、平溪、瑞芳、雙溪、貢寮）',
    legislators: [
      { name: '賴品妤' }
    ]
  },
  {
    name: '桃園市第一選舉區（蘆竹、龜山、桃園）',
    legislators: [
      { name: '鄭運鵬' }
    ]
  },
  {
    name: '桃園市第二選舉區（大園、觀音、新屋、楊梅）',
    legislators: [
      { name: '黃世杰' }
    ]
  },
  {
    name: '桃園市第三選舉區（中壢）',
    legislators: [
      { name: '魯明哲' }
    ]
  },
  {
    name: '桃園市第四選舉區（桃園）',
    legislators: [
      { name: '萬美玲' }
    ]
  },
  {
    name: '桃園市第五選舉區（平鎮、龍潭）',
    legislators: [
      { name: '呂玉玲' }
    ]
  },
  {
    name: '桃園市第六選舉區（八德、大溪、復興、中壢）',
    legislators: [
      { name: '趙正宇' }
    ]
  },
  {
    name: '臺中市第一選舉區（大甲、大安、外埔、清水、梧棲）',
    legislators: [
      { name: '蔡其昌' }
    ]
  },
  {
    name: '臺中市第二選舉區（沙鹿、龍井、大肚、烏日、霧峰）',
    legislators: [
      { name: '陳柏惟' }
    ]
  },
  {
    name: '臺中市第三選舉區（后里、神岡、大雅、潭子）',
    legislators: [
      { name: '楊瓊瓔' }
    ]
  },
  {
    name: '臺中市第四選舉區（西屯、南屯）',
    legislators: [
      { name: '張廖萬堅' }
    ]
  },
  {
    name: '臺中市第五選舉區（北屯、北區）',
    legislators: [
      { name: '莊競程' }
    ]
  },
  {
    name: '臺中市第六選舉區（西區、中區、東區、南區）',
    legislators: [
      { name: '黃國書' }
    ]
  },
  {
    name: '臺中市第七選舉區（太平、大里）',
    legislators: [
      { name: '何欣純' }
    ]
  },
  {
    name: '臺中市第八選舉區（豐原、石岡、新社、東勢、和平）',
    legislators: [
      { name: '江啟臣' }
    ]
  },
  {
    name: '臺南市第一選舉區（後壁、白河、北門、學甲、鹽水、新營、柳營、東山、將軍、下營、六甲）',
    legislators: [
      { name: '賴惠員' }
    ]
  },
  {
    name: '臺南市第二選舉區（七股、佳里、麻豆、官田、善化、大內、玉井、楠西、西港、安定、山上、左鎮、南化）',
    legislators: [
      { name: '郭國文' }
    ]
  },
  {
    name: '臺南市第三選舉區（安南、北區）',
    legislators: [
      { name: '陳亭妃' }
    ]
  },
  {
    name: '臺南市第四選舉區（新市、永康、新化）',
    legislators: [
      { name: '林宜瑾' }
    ]
  },
  {
    name: '臺南市第五選舉區（安平、中西區、南區、東區）',
    legislators: [
      { name: '林俊憲' }
    ]
  },
  {
    name: '臺南市第六選舉區（仁德、歸仁、關廟、龍崎、東區）',
    legislators: [
      { name: '王定宇' }
    ]
  },
  {
    name: '高雄市第一選舉區（桃源、那瑪夏、甲仙、六龜、杉林、內門、旗山、美濃、茂林、阿蓮、田寮、燕巢、大社、大樹）',
    legislators: [
      { name: '邱議瑩' }
    ]
  },
  {
    name: '高雄市第二選舉區（茄萣、湖內、路竹、永安、岡山、彌陀、梓官、橋頭）',
    legislators: [
      { name: '邱志偉' }
    ]
  },
  {
    name: '高雄市第三選舉區（楠梓、左營）',
    legislators: [
      { name: '劉世芳' }
    ]
  },
  {
    name: '高雄市第四選舉區（仁武、鳥松、大寮、林園）',
    legislators: [
      { name: '林岱樺' }
    ]
  },
  {
    name: '高雄市第五選舉區（三民、苓雅）',
    legislators: [
      { name: '李昆澤' }
    ]
  },
  {
    name: '高雄市第六選舉區（鼓山、鹽埕、新興、苓雅）',
    legislators: [
      { name: '趙天麟' }
    ]
  },
  {
    name: '高雄市第七選舉區（鳳山）',
    legislators: [
      { name: '許智傑' }
    ]
  },
  {
    name: '高雄市第八選舉區（前鎮、小港、旗津）',
    legislators: [
      { name: '賴瑞隆' }
    ]
  },
  {
    name: '基隆市選舉區',
    legislators: [
      { name: '蔡適應' }
    ]
  },
  {
    name: '宜蘭縣選舉區',
    legislators: [
      { name: '陳歐珀' }
    ]
  },
  {
    name: '新竹縣第一選舉區（新豐鄉、湖口鄉、新埔鎮、芎林鄉、關西鎮、尖石鄉、竹北市）',
    legislators: [
      { name: '林為洲' }
    ]
  },
  {
    name: '新竹縣第二選舉區（竹東鎮、寶山鄉、北埔鄉、峨眉鄉、橫山鄉、五峰鄉、竹北市）',
    legislators: [
      { name: '林思銘' }
    ]
  },
  {
    name: '新竹市選舉區',
    legislators: [
      { name: '鄭正鈐' }
    ]
  },
  {
    name: '苗栗縣第一選舉區（竹南鎮、造橋鄉、後龍鎮、西湖鄉、通霄鎮、銅鑼鄉、苑裡鎮、三義鄉）',
    legislators: [
      { name: '陳超明' }
    ]
  },
  {
    name: '苗栗縣第二選舉區（頭份市、三灣鄉、南庄鄉、苗栗市、頭屋鄉、獅潭鄉、公館鄉、大湖鄉、泰安鄉、卓蘭鎮）',
    legislators: [
      { name: '徐志榮' }
    ]
  },
  {
    name: '彰化縣第一選舉區（伸港鄉、線西鄉、和美鎮、鹿港鎮、福興鄉、秀水鄉）',
    legislators: [
      { name: '陳秀寳' }
    ]
  },
  {
    name: '彰化縣第二選舉區（彰化市、花壇鄉、芬園鄉）',
    legislators: [
      { name: '陳歐珀' }
    ]
  },
  {
    name: '彰化縣第三選舉區（芳苑鄉、二林鎮、埔鹽鄉、溪湖鎮、埔心鄉、大城鄉、竹塘鄉、埤頭鄉、北斗鎮、溪州鄉）',
    legislators: [
      { name: '謝衣鳯' }
    ]
  },
  {
    name: '彰化縣第四選舉區（大村鄉、員林市、永靖鄉、社頭鄉、田尾鄉、田中鎮、二水鄉）',
    legislators: [
      { name: '陳素月' }
    ]
  },
  {
    name: '南投縣第一選舉區（草屯鎮、國姓鄉、埔里鎮、仁愛鄉、中寮鄉、魚池鄉）',
    legislators: [
      { name: '馬文君' }
    ]
  },
  {
    name: '南投縣第二選舉區（南投市、名間鄉、集集鎮、竹山鎮、鹿谷鄉、水里鄉、信義鄉）',
    legislators: [
      { name: '許淑華' }
    ]
  },
  {
    name: '雲林縣第一選舉區（麥寮鄉、臺西鄉、東勢鄉、褒忠鄉、土庫鎮、虎尾鎮、四湖鄉、元長鄉、口湖鄉、水林鄉、北港鎮）',
    legislators: [
      { name: '蘇治芬' }
    ]
  },
  {
    name: '雲林縣第二選舉區（崙背鄉、二崙鄉、西螺鎮、莿桐鄉、林內鄉、斗六市、大埤鄉、斗南鎮、古坑鄉）',
    legislators: [
      { name: '劉建國' }
    ]
  },
  {
    name: '嘉義縣第一選舉區（六腳鄉、東石鄉、朴子市、太保市、布袋鎮、義竹鄉、鹿草鄉、水上鄉）',
    legislators: [
      { name: '蔡易餘' }
    ]
  },
  {
    name: '嘉義縣第二選舉區（溪口鄉、大林鎮、梅山鄉、新港鄉、民雄鄉、竹崎鄉、中埔鄉、番路鄉、阿里山鄉、大埔鄉）',
    legislators: [
      { name: '陳明文' }
    ]
  },
  {
    name: '嘉義市選舉區',
    legislators: [
      { name: '王美惠' }
    ]
  },
  {
    name: '屏東縣第一選舉區（里港鄉、高樹鄉、三地門鄉、霧臺鄉、瑪家鄉、九如鄉、鹽埔鄉、長治鄉、屏東市、麟洛鄉、內埔鄉）',
    legislators: [
      { name: '鍾佳濱' }
    ]
  },
  {
    name: '屏東縣第二選舉區（萬丹鄉、泰武鄉﹑竹田鄉、萬巒鄉、潮州鎮、新園鄉、崁頂鄉、南州鄉、新埤鄉、來義鄉、東港鎮、林邊鄉、佳冬鄉、枋寮鄉、春日鄉、枋山鄉、獅子鄉、牡丹鄉、車城鄉、滿州鄉、恆春鎮、琉球鄉）',
    legislators: [
      { name: '蘇震清' }
    ]
  },
  {
    name: '臺東縣選舉區',
    legislators: [
      { name: '劉櫂豪' }
    ]
  },
  {
    name: '花蓮縣選舉區',
    legislators: [
      { name: '傅崐萁' }
    ]
  },
  {
    name: '澎湖縣選舉區',
    legislators: [
      { name: '楊曜' }
    ]
  },
  {
    name: '金門縣選舉區',
    legislators: [
      { name: '陳玉珍' }
    ]
  },
  {
    name: '連江縣選舉區',
    legislators: [
      { name: '陳雪生' }
    ]
  },
  {
    name: '平地原住民選舉區',
    legislators: [
      { name: '鄭天財' },
      { name: '陳瑩' },
      { name: '廖國棟' }
    ]
  },
  {
    name: '山地原住民選舉區',
    legislators: [
      { name: '高金素梅' },
      { name: '孔文吉' },
      { name: '伍麗華' }
    ]
  },
  {
    name: '民主進步黨（不分區）',
    legislators: [
      { name: '吳玉琴' },
      { name: '洪申翰' },
      { name: '范雲' },
      { name: '羅美玲' },
      { name: '邱泰源' },
      { name: '周春米' },
      { name: '游錫堃' },
      { name: '柯建銘' },
      { name: '管碧玲' },
      { name: '莊瑞雄' },
      { name: '沈發惠' },
      { name: '林楚茵' },
      { name: '湯蕙禎' }
    ]
  },
  {
    name: '中國國民黨（不分區）',
    legislators: [
      { name: '曾銘宗' },
      { name: '葉毓蘭' },
      { name: '李貴敏' },
      { name: '吳斯懷' },
      { name: '鄭麗文' },
      { name: '林文瑞' },
      { name: '廖婉汝' },
      { name: '翁重鈞' },
      { name: '吳怡玎' },
      { name: '陳以信' },
      { name: '張育美' },
      { name: '李德維' },
      { name: '溫玉霞' }
    ]
  },
  {
    name: '台灣民眾黨（不分區）',
    legislators: [
      { name: '賴香伶' },
      { name: '張其祿' },
      { name: '高虹安' },
      { name: '邱臣遠' },
      { name: '蔡壁如' }
    ]
  },
  {
    name: '時代力量（不分區）',
    legislators: [
      { name: '陳椒華' },
      { name: '邱顯智' },
      { name: '王婉諭' }
    ]
  },
];
