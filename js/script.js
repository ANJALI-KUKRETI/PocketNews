const search = document.querySelector(".search");
const searchBar = document.querySelector(".searchBar");
const loader = document.querySelector(".loader");
const container = document.querySelector(".wrapper");
const main = document.querySelector(".main");
const outer = document.querySelector(".outer");
const input = document.querySelector(".input");
const inp = document.querySelector(".inp");
const btn = document.querySelector(".btn");

// ======================Carousel==========================
$(".owl-carousel").owlCarousel({
  autoplay: true,
  autoplayhoverpause: true,
  autoplaytimeout: 100,
  items: 2,
  loop: true,
  nav: true,
  responsive: {
    0: {
      items: 1,
    },
    750: {
      items: 2,
    },
  },
});

// ========================Loader===============================
function displayLoader() {
  loader.style.display = "block";
}
function hideLoader() {
  loader.style.display = "none";
}

const apis = {
  apiKey: "10e3d4b8064742fc9e5bd3093ffbfe8b",
};

let flag = 1;
search.addEventListener("click", () => {
  showSearch(flag);
});
function showSearch(flag) {
  if (flag) {
    searchBar.classList.remove("hidden");
    search.style.backgroundColor = "rgb(228, 15, 15)";
    flag = !flag;
  } else {
    searchBar.classList.add("hidden");
    search.style.backgroundColor = "";
    flag = !flag;
  }
}

//=============================data from API========================

const fetchHeadlines = async function () {
  try {
    displayLoader();
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apis.apiKey}`
    );
    // console.log(res);
    const data = await res.json();
    if (!res.ok) throw new Error("No data found!");
    if (res.ok) {
      hideLoader();
      // console.log(data);
      return data;
    }
  } catch (err) {
    alert(err.msg);
  }
};

const fetchCategory = async function (category) {
  try {
    displayLoader();
    const res = await fetch(
      `https://saurav.tech/NewsAPI/top-headlines/category/${category}/in.json`
    );
    const data = await res.json();
    // console.log(data);
    if (!res.ok) throw new Error("No data found!");
    if (res.ok) {
      hideLoader();
      return data;
    }
  } catch (err) {
    alert(err.msg);
  }
};

const fetchBySearch = async function (query) {
  try {
    displayLoader();
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&sortBy=popularity&apiKey=${apis.apiKey}&pageSize=100`
    );
    const data = await res.json();
    console.log(data);
    if (!res.ok) throw new Error("No data found!");
    if (res.ok) {
      hideLoader();
      return data;
    }
  } catch (err) {
    alert(err.msg);
  }
};

// ===============================Functions================================
function trenDing(arr, func) {
  // console.log(arr);
  return arr.map((item) => func(item)).join(" ");
}

function upperTrends(item) {
  return `<a href="${item.url}" target="_blank" class="post">
  <div class="imgs">
    <img src="${item.urlToImage}" alt="" />
  </div>
  <div class="titleTrend">
   "${item.title}"
  </div>
  <div class="published">"${item.author || "Unknown"}</div>
</a>`;
}
function lowerTrends(item) {
  return `<a href="${item.url}" target="_blank" class="smallPost">
  <div class="image">
    <img src="${item.urlToImage}" alt="" />
  </div>
  <div class="detail">
    <div class="title">
     ${item.title}
    </div>
    <div class="published">${item.author || "Unknown"}</div>
  </div>
</a>`;
}

function upperBusiness(item) {
  return ` <a href="${item.url}" target="_blank" class="post">
<div class="imgs">
  <img src="${item.urlToImage}" alt="" />
</div>
<div class="title">
${item.title}
</div>
<div class="des">
${item.description}
</div>
<div class="published">${item.author || "Unknown"}</div>
</a>`;
}
function lowerBusiness(item) {
  return ` <a href="${item.url}" target="_blank" class="smallPost">
  <div class="image">
    <img src="${item.urlToImage}" alt="" />
  </div>
  <div class="detail">
    <div class="title">
    ${item.title}
    </div>
    <div class="published">${item.author || "Unknown"}</div>
  </div>
</a>`;
}
function particularCard(item) {
  return ` <a href="${item.url}" target="_blank" class="post">
  <div class="imgs">
    <img src="${item.urlToImage}" alt="" />
  </div>
  <div class="titleTrend">
    ${item.title} 
  </div>
  <div class="published">${item.author || "Unknown"}</div>
</a>`;
}
function allParticularCards(data) {
  return `<div class="secondpage">
  <div class="wrap posts">
       ${trenDing([...data], particularCard)}
  </div>
  </div>`;
}
function mainData(data, business, sports) {
  console.log(business);
  const dataN = data.articles;
  const dataB = business.articles;
  const dataS = sports.articles;
  const start1 = 0;
  const start2 = 4;
  return ` 
<section class="trendingPosts">
  <div class="heading">Trending Posts</div>
  <div class="helper"></div>
  <div class="posts">
   ${trenDing(dataN.slice(start1, start1 + 4), upperTrends)}
  </div>
  <div class="smallerPosts">
  ${trenDing(dataN.slice(start2, start2 + 6), lowerTrends)}
    </div>
  </div>
</section>
<section class="newsAsports">
      <div class="news part">
        <div class="heading">Business</div>
        <div class="helper"></div>
        <div class="upper">
        ${trenDing(dataB.slice(0, 1), upperBusiness)}
        </div>
        <div class="lower">
        ${trenDing(dataB.slice(1, 3), lowerBusiness)}
        </div>
      </div>
      <div class="sports part">
        <div class="heading">Sports</div>
        <div class="helper"></div>
        <div class="upper">
        ${trenDing(dataS.slice(0, 1), upperBusiness)}
        </div>
        <div class="lower">
        ${trenDing(dataS.slice(1, 3), lowerBusiness)}
        </div>
      </div>
    </section>`;
}

async function displayMainData() {
  container.innerHTML = "";
  const data = await fetchHeadlines();
  const business = await fetchCategory("business");
  const sports = await fetchCategory("sports");
  const main_page = document.createElement("div");
  main_page.innerHTML = mainData(data, business, sports);
  container.append(main_page);
}
async function displayParticular(data, page) {
  outer.innerHTML = "";
  main.classList.add("hidden");
  container.classList.add("hidden");
  const part = await fetchCategory(data, page);
  console.log(part);
  const tag = document.createElement("div");
  tag.innerHTML = allParticularCards(part.articles);
  outer.append(tag);
}

async function showSearchResults(e) {
  try {
    if (e.keyCode === 13) {
      flag = 0;
      showSearch(flag);
      outer.innerHTML = "";
      const val = input.value.toLowerCase();
      console.log(val);
      if (val.length > 0) {
        const data = await fetchBySearch(val);

        main.classList.add("hidden");
        container.classList.add("hidden");
        const tag = document.createElement("div");
        tag.innerHTML = allParticularCards(data.articles);
        outer.append(tag);
      } else if (val.length === 0) {
        throw new Error("Please enter something");
      }
      input.value = "";
    }
  } catch (err) {
    window.alert(err.message);
  }
}
async function showSearchResultsSmall() {
  try {
    outer.innerHTML = "";
    const val = inp.value.toLowerCase();
    console.log(val);
    if (val.length > 0) {
      const data = await fetchBySearch(val);
      main.classList.add("hidden");
      container.classList.add("hidden");
      const tag = document.createElement("div");
      tag.innerHTML = allParticularCards(data.articles);
      outer.append(tag);
    } else if (val.length === 0) {
      throw new Error("Please enter something");
    }
    input.value = "";
  } catch (err) {
    window.alert(err.message);
  }
}
input.addEventListener("keyup", (e) => {
  showSearchResults(e);
});
btn.addEventListener("click", (e) => {
  e.preventDefault();
  showSearchResultsSmall();
});
window.addEventListener("hashchange", () => {
  if (window.location.hash.slice(1) === "home") {
    const secondPage = document.querySelector(".secondpage");
    secondPage.remove();
    // mainPage.classList.remove("hidden");
    // outer.append(mainPage);
    main.classList.remove("hidden");
    container.classList.remove("hidden");
    outer.append(main);
    outer.append(container);
  } else {
    displayParticular(window.location.hash.slice(1), 1);
  }
});
window.addEventListener("load", () => {
  displayMainData();
  main.classList.remove("hidden");
  container.classList.remove("hidden");
});
