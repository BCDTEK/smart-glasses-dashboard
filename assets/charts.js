/* 智能眼镜监控看板 · 图表与导航逻辑 */
(function () {
  var charts = {};
  var C = {};

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function readColors() {
    C.acc = cssVar('--acc');
    C.acc2 = cssVar('--acc2');
    C.text = cssVar('--text');
    C.sub = cssVar('--sub');
    C.line = cssVar('--line');
    C.card = cssVar('--card');
    C.bg = cssVar('--bg');
    C.accSoft = cssVar('--acc-soft');
    C.good = cssVar('--good');
    C.warn = cssVar('--warn');
    C.pal = [cssVar('--pal-1'), cssVar('--pal-2'), cssVar('--pal-3'), cssVar('--pal-4'),
             cssVar('--pal-5'), cssVar('--pal-6'), cssVar('--pal-7')];
  }

  var axisLabel = function () { return { color: C.sub, fontSize: 10 }; };
  var splitLine = function () { return { lineStyle: { color: C.line, type: 'dashed' } }; };

  function draw(id, option) {
    var el = document.getElementById(id);
    if (!el || !el.clientWidth) return;
    if (charts[id]) { charts[id].dispose(); }
    var ch = echarts.init(el, null, { renderer: 'canvas' });
    ch.setOption(option);
    charts[id] = ch;
  }

  function tooltipBase(extra) {
    var base = {
      trigger: 'axis',
      appendToBody: true,
      backgroundColor: C.card,
      borderColor: C.line,
      textStyle: { color: C.text, fontSize: 11 },
      extraCssText: 'box-shadow:0 4px 16px rgba(0,0,0,.12);border-radius:6px;'
    };
    for (var k in extra) { base[k] = extra[k]; }
    return base;
  }

  /* ---------------- 1. 竞争格局 ---------------- */
  function renderCompetition() {
    var names = ['Meta', '雷鸟 RayNeo', '阿里巴巴', 'XREAL', '小米', '其他'];
    var vals = [68.7, 3.6, 2.6, 2.5, 2.3, 20.4];
    draw('chart-share', {
      animation: false,
      grid: { left: 92, right: 44, top: 6, bottom: 18 },
      tooltip: tooltipBase({ axisPointer: { type: 'shadow' }, formatter: function (p) { return p[0].name + '：' + p[0].value + '%'; } }),
      xAxis: {
        type: 'value', max: 80,
        axisLabel: axisLabel(), axisLine: { show: false }, axisTick: { show: false },
        splitLine: splitLine()
      },
      yAxis: {
        type: 'category', inverse: true, data: names,
        axisLabel: { color: C.text, fontSize: 11 },
        axisLine: { show: false }, axisTick: { show: false }
      },
      series: [{
        type: 'bar',
        barWidth: 13,
        data: vals.map(function (v, i) {
          return { value: v, itemStyle: { color: C.pal[i % C.pal.length], borderRadius: [0, 3, 3, 0] } };
        }),
        label: { show: true, position: 'right', color: C.sub, fontSize: 10, formatter: '{c}%' }
      }]
    });

    var quarters = ['2025Q2', '2026Q2'];
    draw('chart-shipments', {
      animation: false,
      grid: { left: 44, right: 16, top: 28, bottom: 22 },
      legend: { right: 0, top: 0, itemWidth: 8, itemHeight: 8, textStyle: { color: C.sub, fontSize: 10 } },
      tooltip: tooltipBase({ formatter: function (p) {
        return p[0].axisValue + '<br/>' + p.map(function (i) { return i.marker + i.seriesName + '：' + i.value + '%'; }).join('<br/>');
      } }),
      xAxis: {
        type: 'category', data: quarters, barWidth: '38%',
        axisLabel: { color: C.sub, fontSize: 10 },
        axisLine: { lineStyle: { color: C.line } }, axisTick: { show: false }
      },
      yAxis: {
        type: 'value', max: 100, name: '占比 %', nameTextStyle: { color: C.sub, fontSize: 9 },
        axisLabel: { color: C.sub, fontSize: 10, formatter: '{value}%' },
        splitLine: splitLine(), axisLine: { show: false }, axisTick: { show: false }
      },
      series: [
        { name: '无显示（音频/拍摄）', type: 'bar', stack: 's', barWidth: '40%', data: [61.9, 70.3], itemStyle: { color: C.pal[0] }, label: { show: true, color: '#fff', fontSize: 10 } },
        { name: 'AR/ER 显示', type: 'bar', stack: 's', data: [11, 14.3], itemStyle: { color: C.pal[2] }, label: { show: true, color: '#fff', fontSize: 10 } },
        { name: 'VR/MR 头显', type: 'bar', stack: 's', data: [27.1, 15.4], itemStyle: { color: C.pal[6], borderRadius: [3, 3, 0, 0] }, label: { show: true, color: '#fff', fontSize: 10 } }
      ]
    });
  }

  /* ---------------- 2. 企业与产品 ---------------- */
  function renderProducts() {
    draw('chart-type', {
      animation: false,
      legend: { bottom: 0, itemWidth: 8, itemHeight: 8, textStyle: { color: C.sub, fontSize: 10 } },
      tooltip: { trigger: 'item', appendToBody: true, backgroundColor: C.card, borderColor: C.line, textStyle: { color: C.text, fontSize: 11 }, formatter: '{b}：{c} 款（{d}%）' },
      series: [{
        type: 'pie', radius: ['46%', '70%'], center: ['50%', '44%'],
        label: { show: true, color: C.text, fontSize: 10, formatter: function (p) { return Math.round(p.percent) + '%'; } },
        labelLine: { length: 6, length2: 6, lineStyle: { color: C.line } },
        itemStyle: { borderColor: C.card, borderWidth: 2 },
        data: [
          { name: 'AR 眼镜', value: 101, itemStyle: { color: C.pal[0] } },
          { name: 'AI 眼镜', value: 53, itemStyle: { color: C.pal[2] } },
          { name: 'VR 眼镜', value: 21, itemStyle: { color: C.pal[1] } },
          { name: 'MR 眼镜', value: 10, itemStyle: { color: C.pal[4] } }
        ]
      }]
    });

    var pts = [
      { n: 'Ray-Ban Meta Gen2', p: 379, w: 51, t: 'AI 拍摄' },
      { n: 'Ray-Ban Display', p: 799, w: 69, t: '单目全彩' },
      { n: 'Ray-Ban Meta Audio', p: 349, w: 43, t: '纯音频' },
      { n: 'Rokid AI Glasses Style', p: 299, w: 38.5, t: 'AI 拍摄' },
      { n: 'Rokid Max 2', p: 279, w: 75, t: '观影 AR' },
      { n: 'XREAL One', p: 399, w: 82, t: '观影 AR' },
      { n: 'XREAL One Pro', p: 599, w: 87, t: '观影 AR' },
      { n: 'XREAL AURA', p: 1099, w: 95, t: '全彩 AR' },
      { n: 'VITURE Pro 2', p: 299, w: 63, t: '观影 AR' },
      { n: 'VITURE Luma', p: 399, w: 77, t: '观影 AR' },
      { n: 'Even G2', p: 599, w: 36, t: '单绿提示' },
      { n: 'Brilliant Halo', p: 399, w: 40, t: '单绿提示' },
      { n: 'Looktech AI Glasses', p: 199, w: 37, t: 'AI 拍摄' },
      { n: 'XRAI AR2', p: 699, w: 49, t: '单绿提示' },
      { n: 'ASUS AirVision M1', p: 699, w: 87, t: '观影 AR' }
    ];
    draw('chart-scatter', {
      animation: false,
      grid: { left: 46, right: 42, top: 18, bottom: 34 },
      tooltip: {
        trigger: 'item', appendToBody: true, backgroundColor: C.card, borderColor: C.line,
        textStyle: { color: C.text, fontSize: 11 },
        formatter: function (p) { return p.data.n + '<br/>' + p.data.t + ' · 售价 $' + p.data.value[0] + ' · 重量 ' + p.data.value[1] + 'g'; }
      },
      xAxis: {
        type: 'value', name: '官方定价 ($)', nameLocation: 'middle', nameGap: 20, min: 150, max: 1150,
        nameTextStyle: { color: C.sub, fontSize: 9 },
        axisLabel: axisLabel(), splitLine: splitLine(), axisLine: { show: false }, axisTick: { show: false }
      },
      yAxis: {
        type: 'value', name: '重量 (g)', nameTextStyle: { color: C.sub, fontSize: 9 }, min: 30, max: 100,
        axisLabel: axisLabel(), splitLine: splitLine(), axisLine: { show: false }, axisTick: { show: false }
      },
      series: [{
        type: 'scatter',
        symbolSize: 11,
        data: pts.map(function (o) { return { value: [o.p, o.w], t: o.t, n: o.n, label: { position: o.p > 1000 ? 'left' : 'right' } }; }),
        itemStyle: { color: C.acc, opacity: .72, borderColor: C.card, borderWidth: 1.5 },
        label: {
          show: true, position: 'right', distance: 6,
          color: C.text, fontSize: 9,
          backgroundColor: C.card, padding: [2, 4], borderRadius: 3,
          formatter: function (p) {
            var key = ['Ray-Ban Meta Gen2', 'Ray-Ban Display', 'Rokid AI Glasses Style', 'XREAL One Pro', 'VITURE Pro 2', 'Even G2', 'XRAI AR2', 'XREAL AURA'];
            return key.indexOf(p.data.n) > -1 ? p.data.n : '';
          }
        },
        labelLayout: { hideOverlap: true }
      }]
    });
  }

  /* ---------------- 3. 技术路线 ---------------- */
  function renderRoutes() {
    var dims = ['成本控制', '视场角', '亮度', '轻量化', '量产良率', '显示效果'];
    draw('chart-radar', {
      animation: false,
      legend: { bottom: 0, itemWidth: 8, itemHeight: 8, textStyle: { color: C.sub, fontSize: 10 } },
      tooltip: { appendToBody: true, backgroundColor: C.card, borderColor: C.line, textStyle: { color: C.text, fontSize: 11 } },
      radar: {
        center: ['50%', '47%'], radius: '66%', splitNumber: 4,
        indicator: dims.map(function (d) { return { name: d, max: 100 }; }),
        axisName: { color: C.sub, fontSize: 10.5 },
        splitLine: { lineStyle: { color: C.line } },
        splitArea: { areaStyle: { color: ['transparent', 'transparent'] } },
        axisLine: { lineStyle: { color: C.line } }
      },
      series: [{
        type: 'radar',
        symbolSize: 3.5,
        lineStyle: { width: 2.2 },
        emphasis: { lineStyle: { width: 3 } },
        data: [
          { name: 'Birdbath', value: [85, 55, 70, 25, 85, 90], itemStyle: { color: C.pal[0] }, areaStyle: { opacity: .06 } },
          { name: '衍射光波导', value: [45, 70, 55, 92, 70, 60], itemStyle: { color: C.pal[3] }, areaStyle: { opacity: .05 } },
          { name: '几何光波导', value: [30, 75, 92, 85, 35, 88], itemStyle: { color: C.pal[2] }, areaStyle: { opacity: .05 } },
          { name: '体全息波导', value: [50, 60, 60, 88, 30, 72], itemStyle: { color: C.pal[4] }, areaStyle: { opacity: .05 } }
        ]
      }]
    });

    var years = ['2024', '2025', '2026F', '2027F', '2028F'];
    draw('chart-micro', {
      animation: false,
      grid: { left: 42, right: 20, top: 26, bottom: 22 },
      tooltip: tooltipBase({ formatter: function (p) { return p[0].axisValue + '：' + p[0].value + ' 万台'; } }),
      xAxis: {
        type: 'category', boundaryGap: false, data: years,
        axisLabel: axisLabel(), axisLine: { lineStyle: { color: C.line } }, axisTick: { show: false }
      },
      yAxis: {
        type: 'value', name: '万台', nameTextStyle: { color: C.sub, fontSize: 9 }, max: 400,
        axisLabel: axisLabel(), splitLine: splitLine(), axisLine: { show: false }, axisTick: { show: false }
      },
      series: [{
        name: 'AR 眼镜出货量', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
        data: [55, 62, 131, 235, 360],
        lineStyle: { width: 2.4, color: C.acc },
        itemStyle: { color: C.acc },
        areaStyle: { color: C.accSoft },
        label: { show: true, position: 'top', color: C.sub, fontSize: 10, formatter: '{c}' }
      }]
    });
  }

  /* ---------------- 4. 应用场景 ---------------- */
  function renderScenarios() {
    /* 场景页由静态卡片、成熟度面板与详情弹窗构成，无图表 */
  }

  /* ---------------- 5. 技术进展 ---------------- */
  function renderProgress() {
    var years = ['2024', '2025', '2026F'];
    draw('chart-trend', {
      animation: false,
      grid: { left: 48, right: 44, top: 30, bottom: 22 },
      legend: { top: 0, right: 0, itemWidth: 8, itemHeight: 8, textStyle: { color: C.sub, fontSize: 10 } },
      tooltip: tooltipBase({ formatter: function (p) {
        return p[0].axisValue + '<br/>' + p.map(function (i) { return i.marker + i.seriesName + '：' + i.value + (i.seriesName === '同比' ? '%' : ' 万台'); }).join('<br/>');
      } }),
      xAxis: { type: 'category', data: years, axisLabel: { color: C.sub, fontSize: 10 }, axisLine: { lineStyle: { color: C.line } }, axisTick: { show: false } },
      yAxis: [
        { type: 'value', name: '万台', nameTextStyle: { color: C.sub, fontSize: 9 }, max: 2600, axisLabel: axisLabel(), splitLine: splitLine(), axisLine: { show: false }, axisTick: { show: false } },
        { type: 'value', name: '同比 %', nameTextStyle: { color: C.sub, fontSize: 9 }, min: 0, max: 60, axisLabel: { color: C.sub, fontSize: 10, formatter: '{value}%' }, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } }
      ],
      series: [
        { name: '全球出货量', type: 'bar', barWidth: '42%', data: [1019, 1477.3, 2368.7], itemStyle: { color: C.acc, borderRadius: [3, 3, 0, 0] }, label: { show: true, position: 'top', color: C.sub, fontSize: 10 } },
        { name: '同比', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 6, data: [30.5, 44.2, 26.3], lineStyle: { width: 2, color: C.pal[3] }, itemStyle: { color: C.pal[3] }, label: { show: true, position: 'top', color: C.sub, fontSize: 10, formatter: '{c}%' } }
      ]
    });

    var cats = ['无显示', 'AR/ER 显示', 'VR/MR 头显'];
    draw('chart-launch', {
      animation: false,
      grid: { left: 44, right: 46, top: 30, bottom: 22 },
      legend: { top: 0, right: 0, itemWidth: 8, itemHeight: 8, textStyle: { color: C.sub, fontSize: 10 } },
      tooltip: tooltipBase({ formatter: function (p) {
        return p[0].axisValue + '<br/>' + p.map(function (i) { return i.marker + i.seriesName + '：' + i.value + (i.seriesName === '中国同比' ? '%' : ' 万台'); }).join('<br/>');
      } }),
      xAxis: { type: 'category', data: cats, axisLabel: { color: C.sub, fontSize: 10 }, axisLine: { lineStyle: { color: C.line } }, axisTick: { show: false } },
      yAxis: [
        { type: 'value', name: '万台', nameTextStyle: { color: C.sub, fontSize: 9 }, max: 300, axisLabel: axisLabel(), splitLine: splitLine(), axisLine: { show: false }, axisTick: { show: false } },
        { type: 'value', name: '中国同比 %', nameTextStyle: { color: C.sub, fontSize: 9 }, min: -60, max: 150, axisLabel: { color: C.sub, fontSize: 10, formatter: '{value}%' }, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } }
      ],
      series: [
        { name: '全球出货', type: 'bar', barWidth: '34%', data: [249.4, 50.5, 54.8], itemStyle: { color: C.acc, borderRadius: [3, 3, 0, 0] }, label: { show: true, position: 'top', color: C.sub, fontSize: 10 } },
        { name: '中国同比', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 6, data: [-35.4, 123.0, -34.4], lineStyle: { width: 2, color: C.pal[3] }, itemStyle: { color: C.pal[3] }, label: { show: true, position: 'top', color: C.sub, fontSize: 10, formatter: '{c}%' } }
      ]
    });
  }

  var builders = {
    competition: renderCompetition,
    products: renderProducts,
    routes: renderRoutes,
    scenarios: renderScenarios,
    progress: renderProgress
  };

  var meta = {
    competition: ['市场竞争格局', '全球出货规模、份额集中度与机构口径对照'],
    products: ['企业与产品', '64 家企业 · 185 款机型 · 类型与价格重量分布'],
    routes: ['技术路线', '光学方案、微显示与量产成熟度'],
    scenarios: ['应用场景', '六大场景 · 点击卡片查看详情'],
    progress: ['技术进展', '规模、资本、政策与关键里程碑']
  };

  var rendered = {};

  function show(key) {
    readColors();
    Array.prototype.forEach.call(document.querySelectorAll('#nav button'), function (b) {
      b.classList.toggle('on', b.getAttribute('data-key') === key);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.page'), function (p) {
      p.classList.toggle('on', p.id === 'page-' + key);
    });
    document.getElementById('page-title').textContent = meta[key][0];
    document.getElementById('page-sub').textContent = meta[key][1];
    // 切换后布局可见再渲染，保证容器尺寸正确
    requestAnimationFrame(function () {
      builders[key]();
      rendered[key] = true;
    });
  }

  document.getElementById('nav').addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (btn) { show(btn.getAttribute('data-key')); }
  });

  /* 主题 / 主色切换 */
  function rerenderAll() {
    readColors();
    Object.keys(rendered).forEach(function (k) { if (rendered[k]) { builders[k](); } });
  }

  document.getElementById('swatches').addEventListener('click', function (e) {
    var sw = e.target.closest('.sw');
    if (!sw) return;
    Array.prototype.forEach.call(this.querySelectorAll('.sw'), function (s) { s.classList.remove('on'); });
    sw.classList.add('on');
    document.documentElement.style.setProperty('--acc', sw.getAttribute('data-acc'));
    document.documentElement.style.setProperty('--acc2', sw.getAttribute('data-acc2'));
    document.documentElement.style.setProperty('--acc-soft', hexToRgba(sw.getAttribute('data-acc'), .10));
    document.documentElement.style.setProperty('--pal-1', sw.getAttribute('data-acc'));
    rerenderAll();
  });

  function hexToRgba(hex, a) {
    var h = hex.replace('#', '');
    var r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  var btnLight = document.getElementById('btn-light');
  var btnDark = document.getElementById('btn-dark');
  btnLight.addEventListener('click', function () {
    document.documentElement.setAttribute('data-theme', 'light');
    btnLight.classList.add('on'); btnDark.classList.remove('on');
    rerenderAll();
  });
  btnDark.addEventListener('click', function () {
    document.documentElement.setAttribute('data-theme', 'dark');
    btnDark.classList.add('on'); btnLight.classList.remove('on');
    rerenderAll();
  });

  window.addEventListener('resize', function () {
    Object.keys(charts).forEach(function (k) { if (charts[k]) { charts[k].resize(); } });
  });

  /* ---------------- 应用场景详情弹窗 ---------------- */
  var sceneData = {
    inspection: {
      t: '工业制造', sub: '装配指导 · 质检 · 远程专家协作',
      img: 'assets/scene-inspection.jpg',
      s: ['规模商用 2 · 试点 5', '500–3000 nits', '22–28°', '8–12h 外挂电池'],
      desc: '9 个细分方向中 7 个采用单目全彩形态：生产装配、设备维护、质量检测与生产巡检已进入商业化初期，工业远程协作与培训仍以试点为主。招标文件的硬条件通常是 IP66、可换电、能进防爆区，AR 本身不构成采购理由；越靠危险区，本安认证越决定光路选型。',
      prod: ['RealWear Navigator 520', 'Vuzix M4000', 'Rokid X-Craft'],
      func: ['分步装配指导', '缺陷自动检测', '远程标注协作', '防爆本安版本']
    },
    medical: {
      t: '医疗健康', sub: '影像调阅 · 手术示教 · 远程会诊',
      img: 'assets/scene-medical.jpg',
      s: ['商业化初期 6 · 试点 4', '500–1500 nits', '30–50°', '4–8h 可换电'],
      desc: '字幕、低视力辅助等辅助类已能出货，影像与手术仍在示范阶段。亮度全在可控光范围内，真正的门槛是消毒方式、佩戴时长与注册路径；外科手术的亚毫米级配准与无菌操作，通用眼镜方案尚达不到。',
      prod: ['RealWear Arc 3', 'XREAL One Pro', 'Rokid Glass 2'],
      func: ['病历与影像调阅', '手术示教直播', '远程会诊', '低视力辅助']
    },
    logistics: {
      t: '仓储物流', sub: '智能拣选 · 库位导航 · 盘点',
      img: 'assets/scene-logistics.jpg',
      s: ['规模商用 1 · 试点 2', '500–1500 nits', '25–30°', '≥8h 可换电'],
      desc: '7 个方向全部是单目提示：单次动作的信息量只有货位号与数量，难点在不停顿，不在显示效果。冷库场景的低温续航与镜片起雾仍无成熟解；按工位订阅比卖硬件更容易过采购，与 WMS 耦合是落地关键。',
      prod: ['Vuzix M4000', 'Vuzix Z100', 'RealWear Navigator 520'],
      func: ['扫码拣选', '库位导航', '语音播报', 'WMS 系统对接']
    },
    office: {
      t: '企业办公', sub: '会议字幕 · 演讲提词 · 远程协作',
      img: 'assets/scene-office.jpg',
      s: ['商业化初期 4 · 试点 4', '500–1500 nits', '30–55°', '6–8h'],
      desc: '室内可控光、信息密度高，需要连续佩戴 6–8 小时，整机重量建议控制在 80g 以内。手机与电脑的替代品太强，是商业化慢的根本原因；会议字幕与提词「戴上就有用」，比通用显示更有粘性，也更难被硬件对手复制。',
      prod: ['Meta Ray-Ban Display', 'Rokid Glasses', 'Even Realities G2'],
      func: ['会议实时字幕', '演讲提词', '日程与消息提醒', '远程标注协作']
    },
    outdoor: {
      t: '文旅导览', sub: '景区导览 · 展品识别 · 随身巨幕',
      img: 'assets/scene-outdoor.jpg',
      s: ['规模商用 1 · 试点 2', '500–1500 nits', '45–57°', '3–5h 接手机'],
      desc: '靠租赁模式跑通的第一个域：景区与博物馆按次收费，一次性体验 1–3 小时，卫生与近视适配比续航更重要；观影类已规模商用，户外导览需 ≥3000 nits。内容按景区定制，单点投入高、复制难，是规模化的主要瓶颈。',
      prod: ['雷鸟 X3 Pro', 'XREAL One Pro', 'Rokid Glasses'],
      func: ['AR 景点导览', '展品识别讲解', '多语种语音', '随身巨幕观影']
    },
    education: {
      t: '教育培训', sub: '实训跟练 · 远程教学 · 互动答题',
      img: 'assets/scene-education.jpg',
      s: ['商业化初期 3 · 试点 5', '500–1500 nits', '40–55°', '2–4h'],
      desc: '8 个方向没有一个进入规模商用。一节课 45 分钟、设备多人轮换，卫生与佩戴舒适度优先于性能；职校预算低于工厂、对单价更敏感，先做企业培训更容易验证——预算在企业、验收标准明确。医学教育还受触觉缺失与解剖数据授权成本制约。',
      prod: ['XREAL One Pro', '雷鸟 X3 Pro', 'Even Realities G2'],
      func: ['实训步骤跟练', '远程听课', '知识卡片叠加', '操作评分']
    }
  };

  function openScene(key) {
    var d = sceneData[key];
    if (!d) return;
    var img = document.getElementById('m-img');
    img.style.display = '';
    img.src = d.img;
    document.getElementById('m-title').textContent = d.t;
    document.getElementById('m-sub').textContent = d.sub;
    document.getElementById('m-desc').textContent = d.desc;
    ['m-s1', 'm-s2', 'm-s3', 'm-s4'].forEach(function (id, i) {
      document.getElementById(id).textContent = d.s[i];
    });
    document.getElementById('m-prod').innerHTML = d.prod.map(function (x) { return '<span>' + x + '</span>'; }).join('');
    document.getElementById('m-func').innerHTML = d.func.map(function (x) { return '<span>' + x + '</span>'; }).join('');
    document.getElementById('scene-modal').classList.add('on');
  }

  Array.prototype.forEach.call(document.querySelectorAll('.scene-card'), function (card) {
    card.addEventListener('click', function () { openScene(card.getAttribute('data-scene')); });
  });
  var modal = document.getElementById('scene-modal');
  document.getElementById('m-close').addEventListener('click', function () { modal.classList.remove('on'); });
  modal.addEventListener('click', function (e) { if (e.target === modal) { modal.classList.remove('on'); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { modal.classList.remove('on'); } });

  /* 初始化：支持 #hash 直达某个模块，便于预览截图 */
  var hash = (location.hash || '').replace('#', '');
  var initial = builders[hash] ? hash : 'competition';

  /* 出图用：?theme=dark&pal=0..4 预置深浅色与主色 */
  var params = new URLSearchParams(location.search);
  if (params.get('theme') || params.get('pal') !== null) {
    var noAnim = document.createElement('style');
    noAnim.textContent = '*,*::before,*::after{transition:none!important}';
    document.head.appendChild(noAnim);
  }
  if (params.get('theme') === 'dark') { btnDark.click(); }
  var palIndex = params.get('pal');
  if (palIndex !== null) {
    var sws = document.querySelectorAll('#swatches .sw');
    var idx = parseInt(palIndex, 10);
    if (sws[idx]) { sws[idx].click(); }
  }

  show(initial);
  if (params.get('detail')) { openScene(params.get('detail')); }

  // 供外部（截图脚本）调用
  window.__showSection = show;
})();
