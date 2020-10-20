export default class Lissajous {
	ctx = null // canvas context
	context = null // audio context
	source = null
	analyser = null
	analyserR = null
	analyserL = null
	bufsize = null
	filterR = null
	filterL = null
	delay = null
	lfo = null
	depth = null
	splitter = null
	reqId = null
	// gain = null;

	/**
	 * 
	 * @param {object} props 
	 * @param {object} props.ctx - canvas context
	 * 
	 */
	constructor( props = {ctx: null} ) {
		// todo - validate belows
		const { ctx } = props

		this.ctx = ctx
	}

	/**
	 * web audioの初期化を行い。描画を開始する
	 * 
	 * @params {object} audioTrack
	 * 
	 */
	start( audioTrack ) {
		// this._setup()
		this._web_audio_init( audioTrack )
	}

	draw() {
		this._draw()
	}

	clear() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}


	/**
	 * web audio 初期化処理
	 * 
	 * @private
	 */
	_web_audio_init( audioTrack ) {
		this.context = new AudioContext();
		this.source = null;
		this.analyser  = this.context.createAnalyser();
		this.analyserR = this.context.createAnalyser();
		this.analyserL = this.context.createAnalyser();

		this.bufsize = 64;
		this.filterR = this.context.createBiquadFilter();
		this.filterL = this.context.createBiquadFilter();
		this.delay =   this.context.createDelay();
		this.lfo =     this.context.createOscillator();	
		this.depth =   this.context.createGain();
		this.splitter = this.context.createChannelSplitter();

		const stream = new MediaStream( [ audioTrack ])

		const microphone = this.context.createMediaStreamSource(stream);
		microphone.connect(this.splitter);
		this.splitter.connect(this.analyser, 0);
		this.splitter.connect(this.filterR, 1);

		this.filterR.connect(this.delay);
		this.filterR.type = 'lowpass';
		this.filterR.frequency.value = 1600;
		this.filterR.Q.value = 1;
		this.filterR.gain.value = 0;

		this.lfo.start(0);
		this.lfo.connect(this.depth);
		this.lfo.frequency.value=0.00001;
		this.depth.connect(this.delay.delayTime);
		this.depth.gain.value=0.5;

		this.delay.delayTime.value = 0.1;
		this.delay.connect(this.analyserR);

		this.analyser.fftSize = 1024;
		this.analyserR.fftSize = 1024;
	}

	/**
	 * リサージュ図形描画
	 * ref : https://ja.wikipedia.org/wiki/%E3%83%AA%E3%82%B5%E3%82%B8%E3%83%A5%E3%83%BC%E5%9B%B3%E5%BD%A2
	 * 
	 * @param {Array<number>} waveDataX 
	 * @param {Array<number>} waveDataY 
	 * 
	 * @private
	 * 
	 */
	_drawLissajous(waveDataX, waveDataY) {
		const cX = this.ctx.canvas.width / 2;
		const cY = this.ctx.canvas.height / 2;

		this.ctx.beginPath();
		this.ctx.lineJoin = "round";
		this.ctx.lineCap = "round";
		this.ctx.lineWidth = 2;

		// todo - enable to change color
		this.ctx.strokeStyle='rgba(0, 220, 50, 1)';

		for (let i = 0; i < waveDataX.length; i++) {
			const xpos = waveDataX[i] * this.ctx.canvas.height
			const ypos = waveDataY[i] * this.ctx.canvas.height;

			if (i === 0) {
				this.ctx.moveTo(cX + xpos, cY + ypos);
			} else {
				this.ctx.lineTo(cX + xpos, cY + ypos);
			}
		}
		this.ctx.stroke();
	}

	/**
	 * audioTrack の PCM より、リサージュ図形の x, y を更新し
	 * 描画処理を呼ぶ
	 * 
	 * @private
	 */
	_draw() {
		const waveDataL = new Float32Array(this.analyser.frequencyBinCount);
		this.analyser.getFloatTimeDomainData(waveDataL);

		const waveDataR = new Float32Array(this.analyserR.frequencyBinCount);
		this.analyserR.getFloatTimeDomainData(waveDataR);

		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this._drawLissajous(waveDataL, waveDataR);
	}
}