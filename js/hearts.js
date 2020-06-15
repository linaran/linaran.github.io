// Sretna godisnjica malena

hearts = function() {

    config = {
        imageSrc: "images/heart.png",
        heartImageSize: 150,
        heartCount: 3,
        heartSpeed: 0.2,
        physicsTimeStep: 16,
    }

    // Canvas and heart images
    var canvas = null;
    var canvasCtx = null;
    var heartImg = null;
    var heartProps = [];

    // Physics
    var physicsTicker = null;
    var lastTime = performance.now();

    // Drawing
    var requestAnimationId = 0;

    // Date
    var originDate = moment([2017, 5, 15]);

    function onNewCanvas(pCanvas) {
        canvas = pCanvas;
        canvasCtx = canvas.getContext("2d");

        clearInterval(physicsTicker);
        cancelAnimationFrame(requestAnimationId);

        loadHeartImg(function() {
            if (heartProps.length === 0) initHeartProps();
            physicsTicker = getPhysicsTicker();
            requestAnimationId = requestAnimationFrame(draw);
        });
    }

    function loadHeartImg(onLoad=null) {
        if (heartImg == null) {
            heartImg = new Image();
            heartImg.onload = onLoad;
            heartImg.src = config.imageSrc;
        } else if (onLoad != null) {
            onLoad();
        }
    }

    // Clears out heartProps if they already exist
    function initHeartProps() {
        var heartCount = getHeartCount();
        heartProps.length = 0;

        for (var i = 0; i < heartCount; ++i) {
            var heartProp = {
                x: Math.floor(Math.random() * canvas.width),
                y: Math.floor(Math.random() * canvas.height),
                width: getHeartImageSize(),
                height: getHeartImageSize(),
                dx: getHeartSpeed(),
                dy: getHeartSpeed(),
            };
            heartProps.push(heartProp);
        }
    }

    function getHeartCount() {
        var currentDate = moment();
        console.log(currentDate.diff(originDate, 'years'));
        return currentDate.diff(originDate, 'years');
    }

    function getHeartSpeed() {
        return config.heartSpeed;
    }

    function getHeartImageSize() {
        return config.heartImageSize;
    }

    function draw(now) {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        // Consider time interpolation

        for (var i = 0; i < heartProps.length; ++i) {
            var heartProp = heartProps[i];
            canvasCtx.drawImage(
                heartImg, 
                heartProp.x, 
                heartProp.y,
                heartProp.width,
                heartProp.height
            );
        }

        requestAnimationFrame(draw);
    }

    function doPhysics(width, height, dt) {
        for (var i = 0; i < heartProps.length; ++i) {
            var heartProp = heartProps[i];

            heartProp.x += heartProp.dx * dt;
            heartProp.y += heartProp.dy * dt;

            if (heartProp.x < 0) {
                heartProp.x = 0;
                heartProp.dx *= -1;
            } else if (heartProp.x + heartProp.width > width) {
                heartProp.x = width -  heartProp.width;
                heartProp.dx *= -1;
            }

            if (heartProp.y < 0) {
                heartProp.y = 0;
                heartProp.dy *= -1;
            } else if (heartProp.y + heartProp.height > height) {
                heartProp.y = height - heartProp.height;
                heartProp.dy *= -1;
            }
        }
    }

    function getPhysicsTicker() {
        return setInterval(function() {
            var currentTime = performance.now();
            doPhysics(canvas.width, canvas.height, currentTime - lastTime);
            lastTime = currentTime;
        }, config.physicsTimeStep);
    }

    return {
        setCanvas : onNewCanvas,
    }
}();