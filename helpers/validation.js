export const isValidateCommentReview = (comment) => {
    return typeof comment === 'string' && comment.length <= 200 && comment.length > 0
};

export const isValidRating = (rating) => {
    return typeof rating === 'number' && rating >= 0.5 && rating <= 5
};


export const isValidUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{1,20}$/;
    return usernameRegex.test(username);
};

export const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};
