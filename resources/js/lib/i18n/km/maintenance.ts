import type { maintenance as maintenanceEn } from '../en/maintenance';

export const maintenance: typeof maintenanceEn = {
    page: {
        title: 'សំណើជួសជុលរបស់ខ្ញុំ',
        empty: 'អ្នកមិនទាន់បានរាយការណ៍បញ្ហាណាមួយនៅឡើយទេ។',
    },
    table: {
        title: 'ចំណងជើង',
        priority: 'អាទិភាព',
        submitted: 'ថ្ងៃដាក់ស្នើ',
    },
    requestDialog: {
        trigger: 'រាយការណ៍បញ្ហា',
        title: 'រាយការណ៍បញ្ហាជួសជុល',
        roomOption: 'បន្ទប់ {{roomNumber}}',
        titleLabel: 'ចំណងជើង',
        descriptionOptional: 'ការពិពណ៌នា (ស្រេចចិត្ត)',
    },
};
