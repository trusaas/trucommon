export const TruServerMessages = Object.freeze({
    InternalServerError:'Internal server error, Please contact system administrator.', 
    ApiNotFound: 'API not found.',
    MandatoryFieldsMissing: 'Mandatory fields are missing.',
    InvalidEmail: 'Invalid email.',
    InvalidData: 'Invalid data.',
    InvalidSession: 'Invalid session.',
    InvalidDetailsOrSession: 'Invalid details / session.',
    InvalidDataConversion: 'Invalid data conversion.',
    SuccessfullySignedOut: 'Successfully signed out.',
    Team: {
        InvitationSentSuccessfully: 'Invitation sent successfully.',
        InvitationAcceptedSuccessfully: 'Invitation accepted successfully.',
    }, 
    Account : {
        CreatedSuccessfully: 'Account created successfully.',
        NotFound: 'Account not found.',
        EmailUpdatedAndConfirmationSentSuccessfully: 'Email updated and confirmation sent successfully.',
        ConfirmationSentSuccessfully: 'Confirmation sent successfully.',
        NotActiveOrConfirmed: 'Account was not active or confirmed.',
        UserAlreadyExists: 'User with this email already exists.',
        AccountAlreadyExists: 'Account with this name already exists.',
    },
    Confirmation : {
        SuccessfullyConfirmed: 'Account confirmation successfull.',
        InvalidData: 'Invalid data.',
    },
    Singin :  {
        SuccessfullySiginin: 'Successfull singed in.',
        InvalidData: 'Invalid data.',
        ConfirmationPending: 'Confirmation Pending / Email not verified.',
        InActive: 'In active.',
        StatusNotDefined: 'Status not defined.',
        UserNotExists: 'User/Account with given details not exists',
        ResetMailSent: 'Reset password link sent to registered mail address',
        PasswordResetSuccess:'Password reset successfully',
        PasswordConfirmPasswordNotSame:'Confirm password is not same as password',
    },
});