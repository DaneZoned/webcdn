var code = {
    setup: {
        background: '#000',
        minimumSize: 0.5,
        globalScale: 20,
        zoom: {
            start: 1,
            step: -1.25
        }
    },
    startShape: 'start',
    start: {
        shapes: [
            {
                shape: "element",
                HSLA: [47, 0.7, 1, 1]
            },
            {
                shape: "element",
                HSLA: [70, 0.7, 1, 1],
                rotate: 180
            }
		]
    },
    element: [
        {
            shapes: [
                {
                    shape: "SQUARE"
                },
                {
                    shape: "element",
                    x: .9,
                    scale: .99
                }
			]
		},
        {
            weight: 0.026,
            shapes: [
                {
                    shape: "SQUARE"
                },
                {
                    shape: "element",
                    x: .9,
                    rotate: 90,
                    scale: .99,
                    light: -0.075
                },
                {
                    shape: "element",
                    x: .9,
                    rotate: -90,
                    scale: .99,
                    light: -0.075
                }
			]
		},
        {
            weight: 0.01,
            shapes: [
                {
                    shape: "SQUARE"
                },
                {
                    shape: "element",
                    x: .6,
                    y: .15,
                    rotate: 30,
                    scale: .99
                }
			]
		},
        {
            weight: 0.01,
            shapes: [
                {
                    shape: "SQUARE"
                },
                {
                    shape: "element",
                    x: .6,
                    y: -.15,
                    rotate: -30,
                    scale: .99
                }
			]
		},
        {
            weight: 0.002,
            shape: "SQUARE",
            scale: 10
		}
	]
};

CFAjs.render(code);