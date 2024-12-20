const buildings = [
    {
      name: 'MS',
      fullName: 'Wydział Matematyki Stosowanej',
      floors: [
        {
          floorNumber: 1,
          classrooms: [
            { number: '101', status: 'empty' },
            { number: '102', status: 'empty' },
            { number: '103', status: 'empty' },
            // Add more classrooms as needed
          ]
        },
        {
          floorNumber: 2,
          classrooms: [
            { number: '201', status: 'empty' },
            { number: '202', status: 'empty' },
            { number: '203', status: 'empty' },
            // Add more classrooms as needed
          ]
        }
      ]
    }
    // You can add more buildings here
  ];
  
  export default buildings;