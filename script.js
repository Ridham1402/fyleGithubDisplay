const itemsPerPage = 10; // Adjust as needed

async function fetchUserDetails() {
    const username = document.getElementById('username').value;
    const userApiUrl = `https://api.github.com/users/${username}`;
    const reposApiUrl = `https://api.github.com/users/${username}/repos?per_page=${itemsPerPage}`;

    try {
        const [userResponse, reposResponse] = await Promise.all([
            fetch(userApiUrl),
            fetch(reposApiUrl)
        ]);

        if (!userResponse.ok) {
            console.log("user error");
            throw new Error(`Error fetching GitHub user details: ${userResponse.statusText}`);
        }

        if (!reposResponse.ok) {
            console.log("repo error");
            throw new Error(`Error fetching GitHub repositories: ${reposResponse.statusText}`);
        }

        const userData = await userResponse.json();
        const repos = await reposResponse.json();

        displayUserDetails(userData);
        displayRepos(repos);
        displayPagination(userData, 1); // Pass userData for total repo count
    } catch (error) {
        console.error(error);
        alert('Error fetching GitHub user details. Please try again.');
    }
}

function displayUserDetails(userData) {
    const userDetailsContainer = document.getElementById('user-details');
    userDetailsContainer.innerHTML = '';

    const userName = document.createElement('p');
    userName.textContent = userData.name;
    userName.className = 'user-name';

    const userAvatar = document.createElement('img');
    userAvatar.src = userData.avatar_url;
    userAvatar.alt = 'User Avatar';
    userAvatar.className = 'user-avatar';

    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';

    const userBio = document.createElement('p');
    userBio.textContent = userData.bio;
    userBio.className = 'user-bio';

    const userLocation = document.createElement('p');
    userLocation.textContent = `Location: ${userData.location}`;
    userLocation.className = 'user-location';

    const userUrls = document.createElement('p');
    userUrls.className = 'user-urls';

    if (userData.blog) {
        const blogLink = document.createElement('a');
        blogLink.href = userData.blog;
        blogLink.target = '_blank';
        blogLink.textContent = 'Blog';
        userUrls.appendChild(blogLink);
    }

    if (userData.html_url) {
        const githubLink = document.createElement('a');
        githubLink.href = userData.html_url;
        githubLink.target = '_blank';
        githubLink.textContent = 'GitHub';
        userUrls.appendChild(githubLink);
    }

    userInfo.appendChild(userAvatar);
    userInfo.appendChild(userBio);
    userDetailsContainer.appendChild(userName);
    userDetailsContainer.appendChild(userInfo);
    userDetailsContainer.appendChild(userLocation);
    userDetailsContainer.appendChild(userUrls);
}

function displayRepos(repos) {
    const reposList = document.getElementById('repos-list');
    reposList.innerHTML = '';

    if (repos.length === 0) {
        reposList.innerHTML = '<p>No repositories found for the given user.</p>';
        return;
    }

    repos.forEach(repo => {
        const repoCard = document.createElement('li');
        repoCard.className = 'repo-card';

        const repoHeader = document.createElement('header');
        repoHeader.textContent = repo.name;

        const repoMain = document.createElement('main');
        const repoDescription = document.createElement('p');
        repoDescription.textContent = repo.description || 'No description available.';
        repoMain.appendChild(repoDescription);

        const repoLanguages = document.createElement('div');
        repoLanguages.className = 'repo-languages';
        repoLanguages.innerHTML = `Languages: ${displayLanguages(repo.languages)}`;
        repoMain.appendChild(repoLanguages);

        repoCard.appendChild(repoHeader);
        repoCard.appendChild(repoMain);
        reposList.appendChild(repoCard);
    });
}

function displayLanguages(languages) {
    if (!languages) {
        return 'Not specified';
    }

    const languageKeys = Object.keys(languages);
    return languageKeys.map(language => `<span>${language}</span>`).join(', ');
}

function displayPagination(userData, currentPage) {
    const paginationContainer = document.getElementById('pagination');
    const pageLinksContainer = document.getElementById('pageLinksContainer');

    paginationContainer.style.display = 'flex';
    pageLinksContainer.innerHTML = '';

    const totalPages = Math.ceil(userData.public_repos / itemsPerPage);

    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    if (currentPage > 1) {
        prevButton.style.display = 'block';
        prevButton.setAttribute('data-page', currentPage - 1);
    } else {
        prevButton.style.display = 'none';
    }

    if (currentPage < totalPages) {
        nextButton.style.display = 'block';
        nextButton.setAttribute('data-page', currentPage + 1);
    } else {
        nextButton.style.display = 'none';
    }

    for (let page = 1; page <= totalPages; page++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = page;
        pageLink.className = 'page-link';
        pageLink.addEventListener('click', () => fetchReposByPage(userData.login, page));

        pageLinksContainer.appendChild(pageLink);
    }
}

function fetchPrevPage() {
    const prevPage = parseInt(document.getElementById('prevPage').getAttribute('data-page'));
    fetchReposByPage(username, prevPage);
}

function fetchNextPage() {
    const nextPage = parseInt(document.getElementById('nextPage').getAttribute('data-page'));
    fetchReposByPage(username, nextPage);
}

async function fetchReposByPage(username, page) {
    const reposApiUrl = `https://api.github.com/users/${username}/repos?per_page=${itemsPerPage}&page=${page}`;

    try {
        const response = await fetch(reposApiUrl);

        if (!response.ok) {
            throw new Error(`Error fetching GitHub repositories: ${response.statusText}`);
        }

        const repos = await response.json();

        displayRepos(repos);
        updatePaginationStyle(page);
    } catch (error) {
        console.error(error);
        alert('Error fetching GitHub repositories. Please try again.');
    }
}

function updatePaginationStyle(currentPage) {
    const pageLinks = document.querySelectorAll('.page-link');
    pageLinks.forEach((link, index) => {
        if (index + 1 === currentPage) {
            link.style.backgroundColor = '#0366d6';
        } else {
            link.style.backgroundColor = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // You can add any initialization code here if needed.
});
