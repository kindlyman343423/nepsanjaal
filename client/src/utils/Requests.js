import appconstants from "./Constants";

const { base_url } = appconstants;

//Auth requests
export const signup = user => {
  return fetch(`${base_url}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const signin = user => {
  return fetch(`${base_url}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const signout = next => {
  if (typeof window !== "undefined") localStorage.removeItem("jwt");
  next();
  return fetch(`${base_url}/signout`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const authenticate = (jwt, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(jwt));
    next();
  }
};

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }

  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};

export const updateUserInLocalStorage = (user, next) => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("jwt")) {
      let auth = JSON.parse(localStorage.getItem("jwt"));
      auth.user = user;
      localStorage.setItem("jwt", JSON.stringify(auth));
      next();
    }
  }
};

//User requests

export const removeUser = (userId, token) => {
  return fetch(`${base_url}/user/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const getProfile = (userId, token) => {
  return fetch(`${base_url}/user/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      return false;
    });
};

export const getAllUsers = () => {
  return fetch(`${base_url}/users`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const getUserById = (userId, token) => {
  return fetch(`${base_url}/user/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const updateUser = (userId, token, user) => {
  console.log("USER DATA UPDATE: ", user);
  return fetch(`${base_url}/user/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: user
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const follow = (token, followId) => {
  return fetch(`${base_url}/user/follow`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ followId })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const unfollow = (token, unfollowId) => {
  return fetch(`${base_url}/user/unfollow`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ unfollowId })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const getProfileImage = id => {
  return `${base_url}/user/photo/${id}?${new Date().getTime()}`;
};

export const findPeople = (userId, token) => {
  return fetch(`${base_url}/user/findpeople/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

// Posts requests
export const createPost = (token, post) => {
  return fetch(`${base_url}/post`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: post
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const postList = () => {
  return fetch(`${base_url}/posts`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const getPostById = postId => {
  return fetch(`${base_url}/post/${postId}`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const getPostByUser = (userId, token) => {
  return fetch(`${base_url}/posts/by/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const removePost = (postId, token) => {
  return fetch(`${base_url}/post/${postId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const updatePost = (postId, token, post) => {
  return fetch(`${base_url}/post/${postId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: post
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

// Post like and unlike
export const like = (token, postId) => {
  return fetch(`${base_url}/post/like`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ postId })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const unlike = (token, postId) => {
  return fetch(`${base_url}/post/unlike`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ postId })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const comment = (token, postId, comment) => {
  return fetch(`${base_url}/post/comment`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ postId, comment })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const uncomment = (token, postId, comment) => {
  return fetch(`${base_url}/post/uncomment`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ postId, comment })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const socialLogin = user => {
  return fetch(`${base_url}/social-login/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      console.log("signin response: ", response);
      return response.json();
    })
    .catch(err => console.log(err));
};

export const forgotPassword = email => {
  return fetch(`${base_url}/forgot-password/`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  })
    .then(response => {
      console.log("forgot password response: ", response);
      return response.json();
    })
    .catch(err => console.log(err));
};
