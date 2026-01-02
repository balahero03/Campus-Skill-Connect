export const users = [
    {
        id: 1,
        name: 'Arun Kumar',
        department: 'Computer Engineering',
        year: '3rd Year',
        rating: 4.8,
        avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        bio: 'Passionate full-stack developer and UI designer. Love building things for the web.'
    },
    {
        id: 2,
        name: 'Priya Sharma',
        department: 'Electronics',
        year: '2nd Year',
        rating: 4.9,
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        bio: 'Video editing wizard. specialized in Adobe Premiere Pro and After Effects.'
    }
];

export const skills = [
    {
        id: 1,
        title: 'Professional Logo Design',
        description: 'I will create a stunning, professional logo for your brand or project. With experience in Adobe Illustrator.',
        category: 'Design',
        price: 500,
        provider: users[0],
        rating: 4.8,
        image_url: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 2,
        title: 'Video Editing Service',
        description: 'Expert video editing services for YouTube. Cuts, transactions, color grading.',
        category: 'Editing',
        price: 800,
        provider: users[1],
        rating: 4.9,
        image_url: 'https://images.unsplash.com/photo-1574717433054-e42c93317b63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 3,
        title: 'Web Development',
        description: 'Full website creation using React and Tailwind CSS. Responsive and modern.',
        category: 'Coding',
        price: 2000,
        provider: users[0],
        rating: 4.8,
        image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
];

export const currentUser = users[0];
