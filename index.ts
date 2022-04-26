import * as Fs from 'fs';
import * as Path from 'path'


class FileUtils
{
	/*
		Copies all files from directory and it's subdirectories to the specified folder
	*/
	static recursiveCopy(dirPath : Fs.PathLike, moveTo : Fs.PathLike) : void
	{
		Fs.readdir(dirPath, (err, files) => {

			if(err)
				throw err;

			for(let i = 0; i < files.length; i++)
			{
				let file = Path.join(dirPath.toString(), files[i]);

				Fs.stat(file, (err, stat) => {

					if(err)
						return;

					if(stat.isDirectory())
					{
						this.recursiveCopy(file, moveTo);
					}
					else
					{						
						let newPath = Path.join(moveTo.toString(), Path.basename(file));

						Fs.copyFile(file, newPath, (err) => {

							if(err)
								throw err;

						});
						
					}
					
				});

			}			
		});
	}
	
	/*
		Copies all files from directory and it's subdirectories to the parent one
	*/
	static flat(dirToFlat : string) : void
	{
		let basePath = Path.dirname(dirToFlat);
		this.recursiveCopy(dirToFlat, basePath);

	}

	/*
		Converts json formatted file content to object and returns it
	*/
	static readJSON(jsonPath : string) : any
	{
		let file = Fs.openSync(jsonPath, 'r');
		
		if(file)
		{
			let str = Fs.readFileSync(file).toString();
			let json = JSON.parse(str);
		
			Fs.closeSync(file);

			return json; 

		}

		return null;
	}

	/*
		Moves file to the specified directory on condition
	*/
	static moveFile(fileToMove : string, moveToDir : string, predicate: (file : string) => boolean) : boolean
	{
		if(predicate == null || predicate(fileToMove)){
		 
			let dest = Path.join(moveToDir, Path.basename(fileToMove));

			Fs.renameSync(fileToMove, dest);

			return true;
		}
	
		return false;
	}

	
	
}

function task1()
{
	console.log("Task 1")
	function moveExtra(dir : string, destinationDir : string, gender : string) : void
	{
		Fs.readdir(dir, (err, files) => {

			for(let i = 0; i < files.length; i++)
			{
				let file = files[i];
				
				FileUtils.moveFile(Path.join(dir, file), destinationDir, (file) => {
					
					let json = FileUtils.readJSON(file);
		
					return json.gender === gender;
				})
		
			}
		
		});
	}

	moveExtra('boys/', 'girls/', 'female');
	moveExtra('girls/', 'boys/', 'male');
}

function task2(){
	
	console.log("Task 2")
	let p = FileUtils.flat('level1/');

}
