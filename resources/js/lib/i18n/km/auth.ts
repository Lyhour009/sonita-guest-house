import type { Dictionary } from '../translate';

export const auth: Dictionary['auth'] = {
    confirmPassword: {
        headTitle: 'បញ្ជាក់ពាក្យសម្ងាត់',
        passkeyLabel: 'បញ្ជាក់ដោយប្រើសោសម្ងាត់ (Passkey)',
        passkeyLoadingLabel: 'កំពុងបញ្ជាក់...',
        passkeySeparator: 'ឬបញ្ជាក់ដោយប្រើពាក្យសម្ងាត់',
        passwordLabel: 'ពាក្យសម្ងាត់',
        passwordPlaceholder: 'ពាក្យសម្ងាត់',
        submitButton: 'បញ្ជាក់ពាក្យសម្ងាត់',
    },
    forgotPassword: {
        headTitle: 'ភ្លេចពាក្យសម្ងាត់',
        emailLabel: 'អាសយដ្ឋានអ៊ីមែល',
        emailPlaceholder: 'email@example.com',
        submitButton: 'ផ្ញើតំណភ្ជាប់កំណត់ពាក្យសម្ងាត់ឡើងវិញ',
        returnPrefix: 'ឬ ត្រឡប់ទៅកាន់',
        returnLink: 'ចូលគណនី',
    },
    login: {
        headTitle: 'ចូលគណនី',
        emailLabel: 'អាសយដ្ឋានអ៊ីមែល',
        emailPlaceholder: 'email@example.com',
        passwordLabel: 'ពាក្យសម្ងាត់',
        passwordPlaceholder: 'ពាក្យសម្ងាត់',
        forgotPasswordLink: 'ភ្លេចពាក្យសម្ងាត់?',
        rememberMe: 'ចងចាំខ្ញុំ',
        submitButton: 'ចូលគណនី',
        noAccountPrefix: 'មិនទាន់មានគណនីមែនទេ?',
        signUpLink: 'ចុះឈ្មោះ',
    },
    register: {
        headTitle: 'ចុះឈ្មោះ',
        nameLabel: 'ឈ្មោះ',
        namePlaceholder: 'ឈ្មោះពេញ',
        emailLabel: 'អាសយដ្ឋានអ៊ីមែល',
        emailPlaceholder: 'email@example.com',
        passwordLabel: 'ពាក្យសម្ងាត់',
        passwordPlaceholder: 'ពាក្យសម្ងាត់',
        confirmPasswordLabel: 'បញ្ជាក់ពាក្យសម្ងាត់',
        confirmPasswordPlaceholder: 'បញ្ជាក់ពាក្យសម្ងាត់',
        submitButton: 'បង្កើតគណនី',
        hasAccountPrefix: 'មានគណនីរួចហើយ?',
        loginLink: 'ចូលគណនី',
    },
    resetPassword: {
        headTitle: 'កំណត់ពាក្យសម្ងាត់ឡើងវិញ',
        emailLabel: 'អ៊ីមែល',
        passwordLabel: 'ពាក្យសម្ងាត់',
        passwordPlaceholder: 'ពាក្យសម្ងាត់',
        confirmPasswordLabel: 'បញ្ជាក់ពាក្យសម្ងាត់',
        confirmPasswordPlaceholder: 'បញ្ជាក់ពាក្យសម្ងាត់',
        submitButton: 'កំណត់ពាក្យសម្ងាត់ឡើងវិញ',
    },
    twoFactorChallenge: {
        headTitle: 'ការផ្ទៀងផ្ទាត់ពីរជាន់',
        recoveryCodeTitle: 'កូដសង្គ្រោះ',
        recoveryCodeDescription:
            'សូមបញ្ជាក់ការចូលប្រើគណនីរបស់អ្នក ដោយបញ្ចូលកូដសង្គ្រោះបន្ទាន់មួយក្នុងចំណោមកូដដែលអ្នកមាន។',
        recoveryCodeToggleText: 'ចូលគណនីដោយប្រើកូដផ្ទៀងផ្ទាត់វិញ',
        authCodeTitle: 'កូដផ្ទៀងផ្ទាត់',
        authCodeDescription:
            'បញ្ចូលកូដផ្ទៀងផ្ទាត់ដែលបានផ្តល់ដោយកម្មវិធីផ្ទៀងផ្ទាត់របស់អ្នក។',
        authCodeToggleText: 'ចូលគណនីដោយប្រើកូដសង្គ្រោះវិញ',
        recoveryCodePlaceholder: 'បញ្ចូលកូដសង្គ្រោះ',
        continueButton: 'បន្ត',
        orPrefix: 'ឬអ្នកអាច',
    },
    verifyEmail: {
        headTitle: 'ការផ្ទៀងផ្ទាត់អ៊ីមែល',
        verificationSentMessage:
            'តំណភ្ជាប់ផ្ទៀងផ្ទាត់ថ្មីមួយត្រូវបានផ្ញើទៅកាន់អាសយដ្ឋានអ៊ីមែលដែលអ្នកបានផ្តល់ក្នុងពេលចុះឈ្មោះ។',
        resendButton: 'ផ្ញើអ៊ីមែលផ្ទៀងផ្ទាត់ម្តងទៀត',
        logoutLink: 'ចាកចេញ',
    },
    passwordInput: {
        showPassword: 'បង្ហាញពាក្យសម្ងាត់',
        hidePassword: 'លាក់ពាក្យសម្ងាត់',
    },
    passkeys: {
        verify: {
            signInLabel: 'ចូលគណនីដោយប្រើសោសម្ងាត់ (Passkey)',
            authenticatingLabel: 'កំពុងផ្ទៀងផ្ទាត់...',
            orContinueWithEmail: 'ឬបន្តដោយប្រើអ៊ីមែល',
        },
        manage: {
            heading: 'សោសម្ងាត់ (Passkeys)',
            description:
                'គ្រប់គ្រងសោសម្ងាត់របស់អ្នក សម្រាប់ការចូលគណនីដោយមិនប្រើពាក្យសម្ងាត់',
            emptyTitle: 'មិនទាន់មានសោសម្ងាត់នៅឡើយទេ',
            emptyDescription:
                'បន្ថែមសោសម្ងាត់ដើម្បីចូលគណនីដោយមិនចាំបាច់ប្រើពាក្យសម្ងាត់',
        },
        item: {
            removeAriaLabel: 'លុប',
            removeDialogTitle: 'លុបសោសម្ងាត់',
            removeDialogDescription:
                'តើអ្នកប្រាកដជាចង់លុបសោសម្ងាត់ "{{name}}" មែនទេ? អ្នកនឹងលែងអាចប្រើវាដើម្បីចូលគណនីបានទៀត។',
            removingButton: 'កំពុងលុប...',
            removeButton: 'លុបសោសម្ងាត់',
            addedPrefix: 'បានបន្ថែម {{when}}',
            lastUsedPrefix: 'ប្រើចុងក្រោយ {{when}}',
        },
        register: {
            notSupported: 'កម្មវិធីរុករកនេះមិនគាំទ្រសោសម្ងាត់ទេ។',
            addButton: 'បន្ថែមសោសម្ងាត់',
            nameLabel: 'ឈ្មោះសោសម្ងាត់',
            namePlaceholder: 'ឧទាហរណ៍ MacBook Pro, iPhone',
            nameHint: 'ការដាក់ឈ្មោះជួយឱ្យអ្នកសម្គាល់សោសម្ងាត់នេះបានក្រោយមក។',
            registeringButton: 'កំពុងចុះឈ្មោះ...',
            registerButton: 'ចុះឈ្មោះសោសម្ងាត់',
        },
    },
    twoFactor: {
        manage: {
            heading: 'ការផ្ទៀងផ្ទាត់ពីរជាន់',
            description: 'គ្រប់គ្រងការកំណត់ការផ្ទៀងផ្ទាត់ពីរជាន់របស់អ្នក',
            enabledInfo:
                'អ្នកនឹងត្រូវបានស្នើសុំបញ្ចូលកូដសម្ងាត់ដែលមានសុវត្ថិភាព និងផ្លាស់ប្តូរជានិច្ច ក្នុងពេលចូលគណនី ដែលអ្នកអាចទាញយកបានពីកម្មវិធីគាំទ្រ TOTP នៅលើទូរស័ព្ទរបស់អ្នក។',
            disabledInfo:
                'នៅពេលអ្នកបើកការផ្ទៀងផ្ទាត់ពីរជាន់ អ្នកនឹងត្រូវបានស្នើសុំបញ្ចូលកូដសម្ងាត់ដែលមានសុវត្ថិភាព ក្នុងពេលចូលគណនី។ កូដសម្ងាត់នេះអាចទាញយកបានពីកម្មវិធីគាំទ្រ TOTP នៅលើទូរស័ព្ទរបស់អ្នក។',
            disableButton: 'បិទការផ្ទៀងផ្ទាត់ពីរជាន់',
            continueSetupButton: 'បន្តការដំឡើង',
            enableButton: 'បើកការផ្ទៀងផ្ទាត់ពីរជាន់',
        },
        recoveryCodes: {
            title: 'កូដសង្គ្រោះការផ្ទៀងផ្ទាត់ពីរជាន់',
            description:
                'កូដសង្គ្រោះជួយឱ្យអ្នកចូលប្រើគណនីឡើងវិញបាន ប្រសិនបើអ្នកបាត់ឧបករណ៍ផ្ទៀងផ្ទាត់ពីរជាន់។ សូមរក្សាទុកកូដទាំងនេះក្នុងកម្មវិធីគ្រប់គ្រងពាក្យសម្ងាត់ដែលមានសុវត្ថិភាព។',
            viewButton: 'មើលកូដសង្គ្រោះ',
            hideButton: 'លាក់កូដសង្គ្រោះ',
            regenerateButton: 'បង្កើតកូដឡើងវិញ',
            listAriaLabel: 'កូដសង្គ្រោះ',
            loadingAriaLabel: 'កំពុងផ្ទុកកូដសង្គ្រោះ',
            warningPrefix:
                'កូដសង្គ្រោះនីមួយៗអាចប្រើបានតែម្តងគត់ដើម្បីចូលប្រើគណនីរបស់អ្នក ហើយនឹងត្រូវលុបចោលបន្ទាប់ពីប្រើប្រាស់។ ប្រសិនបើអ្នកត្រូវការបន្ថែម សូមចុច',
            warningHighlight: 'បង្កើតកូដឡើងវិញ',
            warningSuffix: 'ខាងលើ។',
        },
        setup: {
            manualEntryHint: 'ឬបញ្ចូលកូដដោយផ្ទាល់',
            backButton: 'ថយក្រោយ',
            confirmButton: 'បញ្ជាក់',
            continueButton: 'បន្ត',
            enabledTitle: 'ការផ្ទៀងផ្ទាត់ពីរជាន់ត្រូវបានបើក',
            enabledDescription:
                'ការផ្ទៀងផ្ទាត់ពីរជាន់ត្រូវបានបើកដំណើរការហើយ។ សូមស្កេន QR កូដ ឬបញ្ចូលកូនសោដំឡើងក្នុងកម្មវិធីផ្ទៀងផ្ទាត់របស់អ្នក។',
            closeButton: 'បិទ',
            verifyTitle: 'ផ្ទៀងផ្ទាត់កូដ',
            verifyDescription:
                'បញ្ចូលកូដលេខ៦ខ្ទង់ពីកម្មវិធីផ្ទៀងផ្ទាត់របស់អ្នក',
            enableTitle: 'បើកការផ្ទៀងផ្ទាត់ពីរជាន់',
            enableDescription:
                'ដើម្បីបញ្ចប់ការបើកការផ្ទៀងផ្ទាត់ពីរជាន់ សូមស្កេន QR កូដ ឬបញ្ចូលកូនសោដំឡើងក្នុងកម្មវិធីផ្ទៀងផ្ទាត់របស់អ្នក',
        },
    },
    settings: {
        profile: {
            headTitle: 'ការកំណត់ប្រវត្តិរូប',
            title: 'ប្រវត្តិរូប',
            description: 'ធ្វើបច្ចុប្បន្នភាពឈ្មោះ និងអាសយដ្ឋានអ៊ីមែលរបស់អ្នក',
            nameLabel: 'ឈ្មោះ',
            namePlaceholder: 'ឈ្មោះពេញ',
            emailLabel: 'អាសយដ្ឋានអ៊ីមែល',
            emailPlaceholder: 'អាសយដ្ឋានអ៊ីមែល',
            saveButton: 'រក្សាទុក',
            unverifiedPrefix: 'អាសយដ្ឋានអ៊ីមែលរបស់អ្នកមិនទាន់បានផ្ទៀងផ្ទាត់ទេ។',
            resendLinkText: 'ចុចទីនេះដើម្បីផ្ញើអ៊ីមែលផ្ទៀងផ្ទាត់ម្តងទៀត។',
            verificationSentMessage:
                'តំណភ្ជាប់ផ្ទៀងផ្ទាត់ថ្មីមួយត្រូវបានផ្ញើទៅកាន់អាសយដ្ឋានអ៊ីមែលរបស់អ្នក។',
        },
        security: {
            headTitle: 'ការកំណត់សុវត្ថិភាព',
            updatePasswordTitle: 'ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់',
            updatePasswordDescription:
                'ត្រូវប្រាកដថាគណនីរបស់អ្នកប្រើពាក្យសម្ងាត់វែង និងស្មុគស្មាញ ដើម្បីរក្សាសុវត្ថិភាព',
            currentPasswordLabel: 'ពាក្យសម្ងាត់បច្ចុប្បន្ន',
            currentPasswordPlaceholder: 'ពាក្យសម្ងាត់បច្ចុប្បន្ន',
            newPasswordLabel: 'ពាក្យសម្ងាត់ថ្មី',
            newPasswordPlaceholder: 'ពាក្យសម្ងាត់ថ្មី',
            confirmPasswordLabel: 'បញ្ជាក់ពាក្យសម្ងាត់',
            confirmPasswordPlaceholder: 'បញ្ជាក់ពាក្យសម្ងាត់',
            saveButton: 'រក្សាទុក',
        },
        appearance: {
            headTitle: 'ការកំណត់រូបរាង',
            title: 'ការកំណត់រូបរាង',
            description: 'ធ្វើបច្ចុប្បន្នភាពការកំណត់រូបរាងសម្រាប់គណនីរបស់អ្នក',
            tabs: {
                light: 'ភ្លឺ',
                dark: 'ងងឹត',
                system: 'ប្រព័ន្ធ',
            },
        },
        deleteAccount: {
            title: 'លុបគណនី',
            description: 'លុបគណនីរបស់អ្នក និងទិន្នន័យទាំងអស់ដែលពាក់ព័ន្ធ',
            warningTitle: 'ការព្រមាន',
            warningMessage:
                'សូមធ្វើដោយប្រុងប្រយ័ត្ន សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។',
            deleteButton: 'លុបគណនី',
            confirmTitle: 'តើអ្នកប្រាកដជាចង់លុបគណនីរបស់អ្នកមែនទេ?',
            confirmDescription:
                'នៅពេលគណនីរបស់អ្នកត្រូវបានលុប ធនធាន និងទិន្នន័យទាំងអស់ដែលពាក់ព័ន្ធ នឹងត្រូវបានលុបជាអចិន្ត្រៃយ៍ផងដែរ។ សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នកដើម្បីបញ្ជាក់ថាអ្នកចង់លុបគណនីនេះជាអចិន្ត្រៃយ៍។',
            passwordLabel: 'ពាក្យសម្ងាត់',
            passwordPlaceholder: 'ពាក្យសម្ងាត់',
        },
    },
};
