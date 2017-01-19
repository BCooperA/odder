module.exports = {
    login: {
        'email': {
            notEmpty: {
                errorMessage: 'Email required'
            },
            isEmail: {
                errorMessage: 'Invalid Email'
            }
        },
        'password': {
            notEmpty: true,
            errorMessage: 'Password required' // Error message for the parameter
        }
    },
    register: {
        'name': {
            notEmpty: {
                errorMessage: 'Name required'
            }
        },
        'email': {
            notEmpty: {
                errorMessage: 'Email required'
            },
            isEmail: {
                errorMessage: 'Invalid Email'
            }
        },
        'password': {
            notEmpty: {
                errorMessage: 'Password required' // Error message for the parameter
            },
            isLength: {
                options: [{ min: 8 }],
                errorMessage: 'Must be minimum of 8 characters long' // Error message for the validator, takes precedent over parameter message
            }
        }
    }
};