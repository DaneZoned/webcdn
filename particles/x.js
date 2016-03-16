This text was downloaded from Beetxt.com
Beetxt.com is the quickest tool to save text online.

This file: http://beetxt.com/s6G
Created: 2016-03-15
-------------------------

window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };


var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var settings = {
    'abstract': {
        'emission_rate': 500,
        'min_life': 1,
        'life_range': 1,
        'min_angle': 0,
        'angle_range': 360,
        'min_speed': 10,
        'speed_range': 100,
        'min_size': 2,
        'size_range': 4,
        'start_colours': [
			[0, 0, 0, 0.8],
			[0, 0, 0, 0.8],
			[0, 0, 0, 0.8]
		],
        'end_colours': [
			[200, 100, 0, 0],
			[200, 100, 0, 0],
			[200, 100, 0, 0]
		],
        'gravity': {
            x: 0,
            y: 0
        },
        'min_position': {
            x: -30,
            y: -30
        },
        'position_range': {
            x: 60,
            y: 60
        }
    }
};
var backup = settings;
var Particle = function (x, y, angle, speed, life, size, start_colour, colour_step) {


    this.pos = {

        x: x || 0,
        y: y || 0
    };


    this.speed = speed || 5;

    this.life = life || 1;

    this.size = size || 2;

    this.lived = 0;


    var radians = angle * Math.PI / 180;

    this.vel = {

        x: Math.cos(radians) * speed,
        y: -Math.sin(radians) * speed
    };


    this.colour = start_colour;
    this.colour_step = colour_step;
};

var Emitter = function (x, y, settings) {


    this.pos = {

        x: x,
        y: y
    };


    this.settings = settings;


    this.emission_delay = 1000 / settings.emission_rate;


    this.last_update = 0;

    this.last_emission = 0;


    this.particles = [];


    this.position_vary = this.settings.position_range || false;

    this.min_position = this.settings.min_position || {
        x: 0,
        y: 0
    };
};

Emitter.prototype.update = function () {


    if (!this.last_update) {

        this.last_update = Date.now();

        return;
    }


    var time = Date.now();


    var dt = time - this.last_update;


    this.last_emission += dt;


    this.last_update = time;


    if (this.last_emission > this.emission_delay) {


        var i = Math.floor(this.last_emission / this.emission_delay);


        this.last_emission -= i * this.emission_delay;

        while (i--) {


            var start_colour = this.settings.start_colours[Math.floor(this.settings.start_colours.length * Math.random())];

            var end_colour = this.settings.end_colours[Math.floor(this.settings.end_colours.length * Math.random())];

            var life = this.settings.min_life + Math.random() * this.settings.life_range;

            var colour_step = [
                (end_colour[0] - start_colour[0]) / life, /* red */
                (end_colour[1] - start_colour[1]) / life, /* green */
                (end_colour[2] - start_colour[2]) / life, /* blue */
                (end_colour[3] - start_colour[3]) / life /* alpha */
            ];

            this.particles.push(
                new Particle(
                    this.min_position.x + (this.position_vary ? Math.random() * this.position_vary.x : 0),
                    this.min_position.y + (this.position_vary ? Math.random() * this.position_vary.y : 0),
                    this.settings.min_angle + Math.random() * this.settings.angle_range,
                    this.settings.min_speed + Math.random() * this.settings.speed_range,
                    life,
                    this.settings.min_size + Math.random() * this.settings.size_range,
                    start_colour.slice(),
                    colour_step
                )
            );
        }
    }


    dt /= 1000;


    var i = this.particles.length;

    while (i--) {

        var particle = this.particles[i];


        if (particle.dead) {


            this.particles.splice(i, 1);

            continue;
        }


        particle.lived += dt;


        if (particle.lived >= particle.life) {

            particle.dead = true;

            continue;
        }


        particle.vel.x += this.settings.gravity.x * dt;
        particle.vel.y += this.settings.gravity.y * dt;

        particle.pos.x += particle.vel.x * dt;
        particle.pos.y += particle.vel.y * dt;


        particle.colour[0] += particle.colour_step[0] * dt;
        particle.colour[1] += particle.colour_step[1] * dt;
        particle.colour[2] += particle.colour_step[2] * dt;
        particle.colour[3] += particle.colour_step[3] * dt;

        ctx.fillStyle = 'rgba(' +
            Math.round(particle.colour[0]) + ',' +
            Math.round(particle.colour[1]) + ',' +
            Math.round(particle.colour[2]) + ',' +
            particle.colour[3] + ')';

        var x = this.pos.x + particle.pos.x;
        var y = this.pos.y + particle.pos.y;

        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    }
};

var emitter = new Emitter(canvas.width / 2, canvas.height / 2, settings.abstract);

function loop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    emitter.update();

    requestAnimFrame(loop);
}

function rain() {

    emitter = new Emitter(100, 60, settings.rain);
}

function abstract() {

    emitter = new Emitter(canvas.width / 2, canvas.height / 2, settings.abstract);
}


window.onload = function () {
    var gui = new dat.GUI({
        autoPlace: false
    });
    var customContainer = $('.moveGUI').append($(gui.domElement));
    var f1 = gui.addFolder('Settings');
    f1.open();
    f1.add(settings.abstract, 'min_life', 0, 3).name('Min Life').listen();
    f1.add(settings.abstract, 'size_range', 0, 10).name('Size Range').listen();
    //f1.add(settings.abstract, 'emission_rate', 500, 1000);
    f1.add(settings.abstract, 'speed_range', 50, 200).name('Speed Range').listen();
    f1.add(settings.abstract.gravity, 'x', -500, 500).name('Gravity x').listen();
    f1.add(settings.abstract.gravity, 'y', -500, 500).name('Gravity y').listen();
    var obj = { add:function(){ 
        settings.abstract.gravity.y =-500; 
        settings.abstract.start_colours = [
			[250, 100, 0, 0.8],
			[200, 50, 0, 0.8],
			[0, 0, 0, 0.8]
		];
		settings.abstract.end_colours = [
			[50, 10, 0, 0.3],
			[50, 10, 0, 0.3],
			[0, 0, 0, 0.3]
		];
		settings.abstract.speed_range = 50;
		settings.abstract.size_range = 7;
		settings.abstract.min_life = 1;
		
		settings.abstract.position_range.x = 60;
		settings.abstract.position_range.y = 60;
		settings.abstract.min_position.x = -30;
		settings.abstract.min_position.y = -30;
    }};
    var ra = { voda:function () {
        settings.abstract.emission_rate = 50;
        settings.abstract.min_life = 2;
        settings.abstract.life_range = 0.3;
        settings.abstract.min_angle = 260;
        settings.abstract.angle_range = 20;
        settings.abstract.min_speed = 30;
        settings.abstract.speed_range = 30;
        settings.abstract.min_size = 1;
        settings.abstract.size_range = 2;
        settings.abstract.start_colours = [
			[130, 196, 245, 0.8],
			[69, 152, 212, 0.8]
		];
		settings.abstract.end_colours = [
			[130, 196, 245, 0.3],
			[69, 152, 212, 0.3]
		];
		settings.abstract.gravity = {
		    x: 20,
		    y: 100
		};
		settings.abstract.min_position.x = 0;
		settings.abstract.min_position.y = 0;
		settings.abstract.position_range.x = canvas.width;
		settings.abstract.position_range.y = -200;
		}
    };
    var restore = { rest:function() {
      
    settings.abstract.emission_rate = 500;
    settings.abstract.min_life = 1;
    settings.abstract.min_angle = 0;
    settings.abstract.angle_range = 360;
    settings.abstract.min_speed = 10;
    settings.abstract.speed_range = 100;
    settings.abstract.min_size = 2;
    settings.abstract.size_range = 4;
    settings.abstract.start_colours = [
			[0, 0, 0, 0.8],
			[0, 0, 0, 0.8],
			[0, 0, 0, 0.8]
		];
	settings.abstract.end_colours = [
			[200, 100, 0, 0],
			[200, 100, 0, 0],
			[200, 100, 0, 0]
		];
	settings.abstract.gravity.x = 0;
	settings.abstract.gravity.y = 0;
	settings.abstract.min_position.x = -30;
	settings.abstract.min_position.y = -30;
    settings.abstract.position_range.y = 60;
    settings.abstract.position_range.x = 60;
}};
    
    
    /*emitter = new Emitter(canvas.width / 2, canvas.height / 2, settings.abstract);*/
    f1.add(obj,'add').name('Fire-ish');
    f1.add(ra, 'voda').name('Rain-ish');
    f1.add(restore, 'rest').name('Restore');
    loop();
};