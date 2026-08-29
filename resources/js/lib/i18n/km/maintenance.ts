import type { maintenance as maintenanceEn } from '../en/maintenance';

export const maintenance: typeof maintenanceEn = {
    page: {
        title: 'សំណើជួសជុលរបស់ខ្ញុំ',
        subtitle: 'បញ្ហាដែលអ្នកបានរាយការណ៍ និងស្ថានភាពបច្ចុប្បន្នរបស់វា។',
        empty: 'អ្នកមិនទាន់បានរាយការណ៍បញ្ហាណាមួយនៅឡើយទេ។',
        emptyDescription: 'រាយការណ៍បញ្ហាអំពីបន្ទប់របស់អ្នក ហើយតាមដានវានៅទីនេះ។',
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
