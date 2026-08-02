/* 経済4択問題集 共通エンジン
   各ページで const QUESTIONS = [...] を定義してから読み込むこと。
   正誤はその場では表示せず、全問終了後にまとめて発表する。 */
(function(){
  const L = ["A","B","C","D"];
  const TOTAL = QUESTIONS.length;
  let order = [], idx = 0, score = 0, log = [];

  const $ = id => document.getElementById(id);

  function shuffle(a){
    for(let i=a.length-1;i>0;i--){ const j=Math.random()*(i+1)|0; [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }

  function start(){
    idx = 0; score = 0; log = [];
    // 選択肢の並びを問題ごとにシャッフル（出題順は固定）
    order = QUESTIONS.map(q => {
      const pairs = q.c.map((t,i)=>({t, ok:i===q.a}));
      shuffle(pairs);
      return {q:q.q, e:q.e, c:pairs.map(p=>p.t), a:pairs.findIndex(p=>p.ok)};
    });
    $("result").classList.add("hide");
    $("quiz").classList.remove("hide");
    window.scrollTo(0,0);
    render();
  }

  function render(){
    const item = order[idx];
    $("prog").style.width = (idx/TOTAL*100) + "%";
    $("count").textContent = `第 ${idx+1} 問 / ${TOTAL}`;
    $("qtext").textContent = item.q;

    const box = $("opts");
    box.innerHTML = "";
    item.c.forEach((text,i)=>{
      const b = document.createElement("button");
      b.className = "opt";
      b.innerHTML = `<span class="mark">${L[i]}</span>`;
      b.appendChild(document.createTextNode(text));
      b.onclick = () => answer(i);
      box.appendChild(b);
    });
  }

  function answer(sel){
    const item = order[idx];
    const ok = sel === item.a;
    if(ok) score++;
    log.push({q:item.q, ok, e:item.e, your:item.c[sel], right:item.c[item.a]});

    // 正誤はその場では見せず、そのまま次の問題へ
    [...$("opts").children].forEach(b => b.disabled = true);
    idx++;
    if(idx < TOTAL) render();
    else finish();
  }

  function finish(){
    $("quiz").classList.add("hide");
    $("result").classList.remove("hide");
    $("sc").textContent = score;
    $("tt").textContent = TOTAL;
    window.scrollTo(0,0);

    const r = score/TOTAL;
    const msgs = window.RANKS || [
      "満点！完璧です",
      "優秀。しっかり身についています",
      "合格ライン。間違えた分野を復習しましょう",
      "もう一歩。解説を読み直してみましょう",
      "基礎からじっくり復習しましょう"
    ];
    $("rank").textContent =
      r === 1  ? msgs[0] :
      r >= .8  ? msgs[1] :
      r >= .6  ? msgs[2] :
      r >= .4  ? msgs[3] : msgs[4];

    const ul = $("rev");
    ul.innerHTML = "";
    log.forEach((l,i)=>{
      const li = document.createElement("li");
      const mark = l.ok ? '<span class="o-i">○</span>' : '<span class="x-i">×</span>';
      const yours = l.ok ? "" : `あなたの解答：${l.your}<br>`;
      li.innerHTML = `<div class="t">${mark}第${i+1}問 ${l.q}</div>`
                   + `<div class="a">${yours}正解：${l.right}<br>${l.e}</div>`;
      ul.appendChild(li);
    });
  }

  $("retry").onclick = start;
  start();
})();
