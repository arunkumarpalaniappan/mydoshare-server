exports.errorCodes = {
    invalidUser : {
        code: 1001,
        msg: 'Invalid user'
    },
    invalidPassword: {
        code: 1002,
        msg: 'Invalid password'
    },
    userExists: {
        code: 1003,
        msg: 'User already exists'
    },
    invalidGroup: {
        code: 1004,
        msg: 'Invalid group'
    },
    groupExists: {
        code: 1005,
        msg: 'Group already exists'
    },
    invalidExpense: {
        code: 1006,
        msg: 'Invalid expense'
    },
    userNotAuthorized: {
        code: 1007,
        msg: 'User not authorized for this action'
    },
    userAlreadyinGroup: {
        code: 1008,
        msg: 'User already present in the group'
    },
    invalidLink: {
        code: 1009,
        msg: 'Invalid verification link'
    },
    verificationEmailFailed: {
        code: 1010,
        msg: 'Verification email sending failed'
    },
    invitationEmailFailed: {
        code: 1011,
        msg: 'Invitation email sending failed'
    },
    welcomeEmailFailed: {
        code: 1012,
        msg: 'Welcome email sending failed'
    },
    passwordResetEmailFailed: {
        code: 1013,
        msg: 'Password reset email sending failed'
    },
    hashFailed: {
        code: 1014,
        msg: 'Password encryption failed'
    },
    hashComparisionFailed: {
        code: 1015,
        msg: 'Hash comparision failed'
    },
    hashGenerationFailed: {
        code: 1016,
        msg: 'Creating hash failed'
    },
    hashDecodeFailed: {
        code: 1017,
        msg: 'Decoding hash failed'
    },
    dbSaveFailed: {
        code: 1018,
        msg: 'Database save failed'
    },
    dbUpdateFailed: {
        code: 1019,
        msg: 'Database update failed'
    },
    dbDeleteFailed: {
        code: 1020,
        msg: 'Database delete failed'
    },
    dbFindFailed: {
        code: 1021,
        msg: 'Database search failed'
    }
};
exports.successCodes = {
    success: {
        code: 2000,
        msg: 'Success'
    },
    userLoggedIn: {
        code: 2001,
        msg: 'User logged in successfully'
    },
    userVerified: {
        code: 2002,
        msg: 'User verified'
    },
    resetEmailSent: {
        code: 2003,
        msg: 'Reset email sent'
    },
    deleteNotification: {
        code: 2004,
        msg: 'Delete notification success'
    }
};