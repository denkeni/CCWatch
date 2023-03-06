import React, { useState, useRef } from 'react';

// API documentation: https://data.ly.gov.tw/getds.action?id=148
export const csvAPIURL = 'https://data.ly.gov.tw/odw/usageFile.action?id=148&type=CSV&fname=148_1007CSV-1.csv';

export const legislatorItems = [
  {
    title: '臺北市', name: '臺北市',
    legislators: [
      { title: '吳思瑤：第一選舉區（北投、士林）', name: '吳思瑤' },
      { title: '何志偉：第二選舉區（大同、士林）', name: '何志偉' },
      { title: '王鴻薇：第三選舉區（中山、松山）', name: '王鴻薇' },
      { title: '高嘉瑜：第四選舉區（內湖、南港）', name: '高嘉瑜' },
      { title: '林昶佐：第五選舉區（萬華、中正）', name: '林昶佐' },
      // 缺額（不再另行辦理補選）
      // { title: '林奕華：第六選舉區（大安）', name: '林奕華' },
      { title: '費鴻泰：第七選舉區（信義、松山）', name: '費鴻泰' },
      { title: '賴士葆：第八選舉區（文山、中正）', name: '賴士葆' }
    ]
  },
  {
    title: '新北市', name: '新北市',
    legislators: [
      { title: '洪孟楷：第一選舉區（石門、三芝、淡水、八里、林口、泰山）', name: '洪孟楷' },
      { title: '林淑芬：第二選舉區（五股、蘆洲、三重）', name: '林淑芬' },
      { title: '余天：第三選舉區（三重）', name: '余天' },
      { title: '吳秉叡：第四選舉區（新莊）', name: '吳秉叡' },
      { title: '蘇巧慧：第五選舉區（樹林、鶯歌、新莊）', name: '蘇巧慧' },
      { title: '張宏陸：第六選舉區（板橋）', name: '張宏陸' },
      { title: '羅致政：第七選舉區（板橋）', name: '羅致政' },
      { title: '江永昌：第八選舉區（中和）', name: '江永昌' },
      { title: '林德福：第九選舉區（永和、中和）', name: '林德福' },
      { title: '吳琪銘：第十選舉區（土城、三峽）', name: '吳琪銘' },
      { title: '羅明才：第十一選舉區（新店、深坑、石碇、坪林、烏來）', name: '羅明才' },
      { title: '賴品妤：第十二選舉區（金山、萬里、汐止、平溪、瑞芳、雙溪、貢寮）', name: '賴品妤' }
    ]
  },
  {
    title: '桃園市', name: '桃園市',
    legislators: [
      { title: '鄭運鵬：第一選舉區（蘆竹、龜山、桃園）', name: '鄭運鵬' },
      { title: '黃世杰：第二選舉區（大園、觀音、新屋、楊梅）', name: '黃世杰' },
      { title: '魯明哲：第三選舉區（中壢）', name: '魯明哲' },
      { title: '萬美玲：第四選舉區（桃園）', name: '萬美玲' },
      { title: '呂玉玲：第五選舉區（平鎮、龍潭）', name: '呂玉玲' },
      { title: '趙正宇：第六選舉區（八德、大溪、復興、中壢）', name: '趙正宇' }
    ]
  },
  {
    title: '臺中市', name: '臺中市',
    legislators: [
      { title: '蔡其昌：第一選舉區（大甲、大安、外埔、清水、梧棲）', name: '蔡其昌' },
      { title: '林靜儀：第二選舉區（沙鹿、龍井、大肚、烏日、霧峰）', name: '林靜儀' },
      { title: '楊瓊瓔：第三選舉區（后里、神岡、大雅、潭子）', name: '楊瓊瓔' },
      { title: '張廖萬堅：第四選舉區（西屯、南屯）', name: '張廖萬堅' },
      { title: '莊競程：第五選舉區（北屯、北區）', name: '莊競程' },
      { title: '黃國書：第六選舉區（西區、中區、東區、南區）', name: '黃國書' },
      { title: '何欣純：第七選舉區（太平、大里）', name: '何欣純' },
      { title: '江啟臣：第八選舉區（豐原、石岡、新社、東勢、和平）', name: '江啟臣' }
    ]
  },
  {
    title: '臺南市', name: '臺南市',
    legislators: [
      { title: '賴惠員：第一選舉區（後壁、白河、北門、學甲、鹽水、新營、柳營、東山、將軍、下營、六甲）', name: '賴惠員' },
      { title: '郭國文：第二選舉區（七股、佳里、麻豆、官田、善化、大內、玉井、楠西、西港、安定、山上、左鎮、南化）', name: '郭國文' },
      { title: '陳亭妃：第三選舉區（安南、北區）', name: '陳亭妃' },
      { title: '林宜瑾：第四選舉區（新市、永康、新化）', name: '林宜瑾' },
      { title: '林俊憲：第五選舉區（安平、中西區、南區、東區）', name: '林俊憲' },
      { title: '王定宇：第六選舉區（仁德、歸仁、關廟、龍崎、東區）', name: '王定宇' }
    ]
  },
  {
    title: '高雄市', name: '高雄市',
    legislators: [
      { title: '邱議瑩：第一選舉區（桃源、那瑪夏、甲仙、六龜、杉林、內門、旗山、美濃、茂林、阿蓮、田寮、燕巢、大社、大樹）', name: '邱議瑩' },
      { title: '邱志偉：第二選舉區（茄萣、湖內、路竹、永安、岡山、彌陀、梓官、橋頭）', name: '邱志偉' },
      { title: '劉世芳：第三選舉區（楠梓、左營）', name: '劉世芳' },
      { title: '林岱樺：第四選舉區（仁武、鳥松、大寮、林園）', name: '林岱樺' },
      { title: '李昆澤：第五選舉區（三民、苓雅）', name: '李昆澤' },
      { title: '趙天麟：第六選舉區（鼓山、鹽埕、新興、苓雅）', name: '趙天麟' },
      { title: '許智傑：第七選舉區（鳳山）', name: '許智傑' },
      { title: '賴瑞隆：第八選舉區（前鎮、小港、旗津）', name: '賴瑞隆' }
    ]
  },
  {
    title: '基隆市', name: '基隆市',
    legislators: [
      { title: '蔡適應', name: '蔡適應' }
    ]
  },
  {
    title: '宜蘭縣', name: '宜蘭縣',
    legislators: [
      { title: '陳歐珀', name: '陳歐珀' }
    ]
  },
  {
    title: '新竹縣', name: '新竹縣',
    legislators: [
      { title: '林為洲：第一選舉區（新豐鄉、湖口鄉、新埔鎮、芎林鄉、關西鎮、尖石鄉、竹北市）', name: '林為洲' },
      { title: '林思銘：第二選舉區（竹東鎮、寶山鄉、北埔鄉、峨眉鄉、橫山鄉、五峰鄉、竹北市）', name: '林思銘' }
    ]
  },
  {
    title: '新竹市', name: '新竹市',
    legislators: [
      { title: '鄭正鈐', name: '鄭正鈐' }
    ]
  },
  {
    title: '苗栗縣', name: '苗栗縣',
    legislators: [
      { title: '陳超明：第一選舉區（竹南鎮、造橋鄉、後龍鎮、西湖鄉、通霄鎮、銅鑼鄉、苑裡鎮、三義鄉）', name: '陳超明' },
      { title: '徐志榮：第二選舉區（頭份市、三灣鄉、南庄鄉、苗栗市、頭屋鄉、獅潭鄉、公館鄉、大湖鄉、泰安鄉、卓蘭鎮）', name: '徐志榮' }
    ]
  },
  {
    title: '彰化縣', name: '彰化縣',
    legislators: [
      { title: '陳秀寳：第一選舉區（伸港鄉、線西鄉、和美鎮、鹿港鎮、福興鄉、秀水鄉）', name: '陳秀寳' },
      { title: '陳歐珀：第二選舉區（彰化市、花壇鄉、芬園鄉）', name: '陳歐珀' },
      { title: '謝衣鳯：第三選舉區（芳苑鄉、二林鎮、埔鹽鄉、溪湖鎮、埔心鄉、大城鄉、竹塘鄉、埤頭鄉、北斗鎮、溪州鄉）', name: '謝衣鳯' },
      { title: '陳素月：第四選舉區（大村鄉、員林市、永靖鄉、社頭鄉、田尾鄉、田中鎮、二水鄉）', name: '陳素月' }
    ]
  },
  {
    title: '南投縣', name: '南投縣',
    legislators: [
      { title: '馬文君：第一選舉區（草屯鎮、國姓鄉、埔里鎮、仁愛鄉、中寮鄉、魚池鄉）', name: '馬文君' },
      { title: '蔡培慧：第二選舉區（南投市、名間鄉、集集鎮、竹山鎮、鹿谷鄉、水里鄉、信義鄉）', name: '蔡培慧' }
    ]
  },
  {
    title: '雲林縣', name: '雲林縣',
    legislators: [
      { title: '蘇治芬：第一選舉區（麥寮鄉、臺西鄉、東勢鄉、褒忠鄉、土庫鎮、虎尾鎮、四湖鄉、元長鄉、口湖鄉、水林鄉、北港鎮）', name: '蘇治芬' },
      { title: '劉建國：第二選舉區（崙背鄉、二崙鄉、西螺鎮、莿桐鄉、林內鄉、斗六市、大埤鄉、斗南鎮、古坑鄉）', name: '劉建國' }
    ]
  },
  {
    title: '嘉義縣', name: '嘉義縣',
    legislators: [
      { title: '蔡易餘：第一選舉區（六腳鄉、東石鄉、朴子市、太保市、布袋鎮、義竹鄉、鹿草鄉、水上鄉）', name: '蔡易餘' },
      { title: '陳明文：第二選舉區（溪口鄉、大林鎮、梅山鄉、新港鄉、民雄鄉、竹崎鄉、中埔鄉、番路鄉、阿里山鄉、大埔鄉）', name: '陳明文' }
    ]
  },
  {
    title: '嘉義市', name: '嘉義市',
    legislators: [
      { title: '王美惠', name: '王美惠' }
    ]
  },
  {
    title: '屏東縣', name: '屏東縣',
    legislators: [
      { title: '鍾佳濱：第一選舉區（里港鄉、高樹鄉、三地門鄉、霧臺鄉、瑪家鄉、九如鄉、鹽埔鄉、長治鄉、屏東市、麟洛鄉、內埔鄉）', name: '鍾佳濱' },
      { title: '蘇震清：第二選舉區（萬丹鄉、泰武鄉﹑竹田鄉、萬巒鄉、潮州鎮、新園鄉、崁頂鄉、南州鄉、新埤鄉、來義鄉、東港鎮、林邊鄉、佳冬鄉、枋寮鄉、春日鄉、枋山鄉、獅子鄉、牡丹鄉、車城鄉、滿州鄉、恆春鎮、琉球鄉）', name: '蘇震清' }
    ]
  },
  {
    title: '臺東縣', name: '臺東縣',
    legislators: [
      { title: '劉櫂豪', name: '劉櫂豪' }
    ]
  },
  {
    title: '花蓮縣', name: '花蓮縣',
    legislators: [
      { title: '傅崐萁', name: '傅崐萁' }
    ]
  },
  {
    title: '澎湖縣', name: '澎湖縣',
    legislators: [
      { title: '楊曜', name: '楊曜' }
    ]
  },
  {
    title: '金門縣', name: '金門縣',
    legislators: [
      { title: '陳玉珍', name: '陳玉珍' }
    ]
  },
  {
    title: '連江縣', name: '連江縣',
    legislators: [
      { title: '陳雪生', name: '陳雪生' }
    ]
  },
  {
    title: '平地原住民', name: '平地原住民',
    legislators: [
      { title: '鄭天財 Sra Kacaw', name: '鄭天財 Sra Kacaw' },
      { title: '陳瑩', name: '陳瑩' },
      { title: '廖國棟Sufin‧Siluko', name: '廖國棟Sufin‧Siluko' }
    ]
  },
  {
    title: '山地原住民', name: '山地原住民',
    legislators: [
      { title: '高金素梅', name: '高金素梅' },
      { title: '孔文吉', name: '孔文吉' },
      { title: '伍麗華Saidhai‧Tahovecahe', name: '伍麗華Saidhai‧Tahovecahe' }
    ]
  },
  {
    title: '民主進步黨（不分區）', name: '民主進步黨（不分區）',
    legislators: [
      { title: '吳玉琴', name: '吳玉琴' },
      { title: '洪申翰', name: '洪申翰' },
      { title: '范雲', name: '范雲' },
      { title: '羅美玲', name: '羅美玲' },
      { title: '邱泰源', name: '邱泰源' },
      { title: '周春米', name: '周春米' },
      { title: '游錫堃', name: '游錫堃' },
      { title: '柯建銘', name: '柯建銘' },
      { title: '莊瑞雄', name: '莊瑞雄' },
      { title: '沈發惠', name: '沈發惠' },
      { title: '林楚茵', name: '林楚茵' },
      { title: '湯蕙禎', name: '湯蕙禎' },
      { title: '陳靜敏', name: '陳靜敏' },
      { title: '陳培瑜', name: '陳培瑜' },
    ]
  },
  {
    title: '中國國民黨（不分區）', name: '中國國民黨（不分區）',
    legislators: [
      { title: '曾銘宗', name: '曾銘宗' },
      { title: '葉毓蘭', name: '葉毓蘭' },
      { title: '李貴敏', name: '李貴敏' },
      { title: '吳斯懷', name: '吳斯懷' },
      { title: '鄭麗文', name: '鄭麗文' },
      { title: '林文瑞', name: '林文瑞' },
      { title: '廖婉汝', name: '廖婉汝' },
      { title: '翁重鈞', name: '翁重鈞' },
      { title: '吳怡玎', name: '吳怡玎' },
      { title: '陳以信', name: '陳以信' },
      { title: '張育美', name: '張育美' },
      { title: '李德維', name: '李德維' },
      { title: '溫玉霞', name: '溫玉霞' }
    ]
  },
  {
    title: '台灣民眾黨（不分區）', name: '台灣民眾黨（不分區）',
    legislators: [
      { title: '賴香伶', name: '賴香伶' },
      { title: '張其祿', name: '張其祿' },
      { title: '邱臣遠', name: '邱臣遠' },
      { title: '吳欣盈', name: '吳欣盈' },
      { title: '陳琬惠', name: '陳琬惠' },
    ]
  },
  {
    title: '時代力量（不分區）', name: '時代力量（不分區）',
    legislators: [
      { title: '陳椒華', name: '陳椒華' },
      { title: '邱顯智', name: '邱顯智' },
      { title: '王婉諭', name: '王婉諭' }
    ]
  },
];
