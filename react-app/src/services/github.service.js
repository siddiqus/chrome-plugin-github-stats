import axios from "axios";

const Utils = {
  delay: async (ms) => {
    return new Promise((res) => setTimeout(res, ms));
  },
  groupBy: (collection, iteratee) => {
    return collection.reduce((result, item) => {
      const key =
        typeof iteratee === "function" ? iteratee(item) : item[iteratee];

      if (!result[key]) {
        result[key] = [];
      }

      result[key].push(item);
      return result;
    }, {});
  },
  getFromUrl: async (apiUrl) => {
    const res = await axios.get(apiUrl);
    return res.data;
  },
  getHtmlFromString: (htmlString) => {
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = htmlString;
    return tempContainer.firstChild;
  },

  modifyUrlParams: (originalUrl, modifications) => {
    const url = new URL(originalUrl);
    const params = new URLSearchParams(url.search);

    // Apply modifications to the parameters
    for (const [key, value] of Object.entries(modifications)) {
      if (value !== null && value !== undefined) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }

    // Update the search portion of the URL
    url.search = params.toString();

    return url.toString();
  },
};

function generateGitHubSearchUrl(organization, author, startDate, endDate) {
  const baseUrl = "https://github.com/search";
  const queryParams = new URLSearchParams();

  // Set the query parameters
  queryParams.set(
    "q",
    `org:${organization} is:pr author:${author} created:>${startDate} created:<${endDate}`
  );
  queryParams.set("type", "pullrequests");
  queryParams.set("ref", "advsearch");

  const url = `${baseUrl}?${queryParams.toString()}`;

  return url;
}

async function getAllIssues(url) {
  const results = [];

  let nextPage = 1;
  let pageCount = 1;

  let apiUrl = url;
  while (true) {
    const res = await Utils.getFromUrl(apiUrl);
    pageCount = res.payload.page_count;

    results.push(...res.payload.results);

    nextPage++;

    if (nextPage > pageCount) {
      break;
    } else {
      apiUrl = Utils.modifyUrlParams(apiUrl, {
        p: nextPage,
      });
    }
  }

  return results;
}

function sortMonthsAscending(monthsArray) {
  return monthsArray.sort((a, b) => {
    const [aYear, aMonth] = a.split("-");
    const [bYear, bMonth] = b.split("-");

    // Compare years
    if (aYear !== bYear) {
      return parseInt(aYear) - parseInt(bYear);
    }

    // If years are the same, compare months
    return parseInt(aMonth) - parseInt(bMonth);
  });
}

// Example usage
function getMonthlyStats(data) {
  const repoNameToPrCounts = {};
  const issuesByMonth = {};

  let totalPrCounts = 0;
  let totalComments = 0;

  data.forEach((pr) => {
    const {
      created,
      repo: { repository },
      num_comments,
    } = pr;

    const month = created.substring(0, 7);

    if (issuesByMonth[month]) {
      issuesByMonth[month].push(pr);
    } else {
      issuesByMonth[month] = [pr];
    }

    if (repoNameToPrCounts[repository.name]) {
      repoNameToPrCounts[repository.name]++;
    } else {
      repoNameToPrCounts[repository.name] = 1;
    }

    totalPrCounts++;
    totalComments += num_comments;
  });

  const issueStatsByMonth = {};

  for (const month of Object.keys(issuesByMonth)) {
    const prs = issuesByMonth[month];

    const prCount = prs.length;

    const prsWithComments = prs.filter((pr) => pr.num_comments > 0);

    // bot comment counts, so deduct 1
    const totalComments = prsWithComments.reduce(
      (sum, pr) => sum + Math.max(0, pr.num_comments - 1),
      0
    );
    const averageNumberOfComments = Math.round(
      totalComments / prsWithComments.length
    );
    console.log(totalComments, averageNumberOfComments);
    const maxNumberOfComments = Math.max(
      ...prsWithComments.map((pr) => pr.num_comments)
    );

    issueStatsByMonth[month] = {
      month,
      prCount,
      averageNumberOfComments,
      maxNumberOfComments,
    };
  }

  let statList = Object.values(issueStatsByMonth);
  statList = sortMonthsAscending(statList);

  const averagePrCountPerMonth = Math.round(
    totalPrCounts / Object.keys(issuesByMonth).length
  );

  const averageCommentsPerPr = Math.round(totalComments / data.length);

  return {
    statList,
    averagePrCountPerMonth,
    totalPrCounts,
    averageCommentsPerPr,
  };
}

export async function getUserData({ author, startDate, endDate }) {
  const organization = "newscred";

  const url = generateGitHubSearchUrl(organization, author, startDate, endDate);

  const data = await getAllIssues(url);

  const avatarUrl = data.length ? data[0].author_avatar_url : null;

  const monthlyStats = getMonthlyStats(data);

  return {
    username: author,
    avatarUrl,
    prList: data,
    ...monthlyStats,
  };
}

// (async()=>{
//     const author = "optisiddiqus";
//     const startDate = "2023-01-01";
//     const endDate = "2023-12-31";

//     const stats = await getStatsForUser({
//         author,
//         startDate,
//         endDate
//     });
//     console.log(stats)
// }
// )()
